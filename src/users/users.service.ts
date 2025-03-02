import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAccountDto,
  CreateUserDto,
  UpdateUserDto,
  UserDto,

} from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as crypto from 'crypto';
import {
  hashPassword,
  validateEmailField,
  generateUniqueKey,
  verifyPasswordHash,
  generateUniqueCode,
  sendEmail,
  checkForRequiredFields,
  compareEnumValueFields,
  validateURLField,
} from 'src/utils/utils.function';
import { BaseResponseTypeDTO, UpdatePasswordDTO } from 'src/utils/utils.types';
import { decode, sign } from 'jsonwebtoken';
import { ThirdPartyLoginDTO } from 'src/auth/dto/auth.dto';
import { AppRole, AuthProvider } from 'src/utils/utils.constant';
import { Users } from './schema/user.schema';
import { AzureOpenaiService } from 'src/azure-openai/azure-openai.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private signPayload<T extends string | object | Buffer>(payload: T): string {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  constructor(
    @InjectModel(Users.name) private readonly UsersModel: Model<Users>,
    // private readonly OpenAiSrv: AzureOpenaiService,
  ) {}


  async createuser(
    CreateUser: CreateAccountDto, // : Promise<User>
  ) {
    // checkForRequiredFields(['userId'], payload);
    const verificationCode = generateUniqueKey(4);

    let emailToUse = CreateUser.email;
    let recordExists = await this.UsersModel.findOne({
      email: emailToUse,
    }).exec();
    if (recordExists?.id) {
      let message = 'User with similar details already exists';
      if (recordExists.email === CreateUser.email) {
        message = 'User with similar email already exists';
      }
      throw new ConflictException(message);
    }
    CreateUser.email = CreateUser.email.toLocaleLowerCase();
    const partialUser: Partial<UserDto> = {
      ...CreateUser,
      uniqueVerificationCode: verificationCode,
    };
    const createdUser = await new this.UsersModel(partialUser);
    const User_created = await createdUser.save();

    //   await sendRenderEmail(htmlEmailTemplate, 'Welcome to Kaijego', [
    //     createdUser.email,
    //   ]);
    return User_created;
  }

  async ThirdPartysignUpOrLogin(payload: ThirdPartyLoginDTO): Promise<any> {
    try {
      // Perform necessary field checks and validations
      checkForRequiredFields(['provider', 'thirdPartyUserId'], payload);
      compareEnumValueFields(
        payload.provider,
        Object.values(AuthProvider),
        'provider',
      );
      let isNewUser = false;

      // Find the user by externalUserId or email
      let record = await this.UsersModel.findOne({
        $or: [
          { externalUserId: payload.thirdPartyUserId },
          { email: payload.email?.toLowerCase() },
        ],
      }).exec();

      // If the user doesn't exist, create a new one
      if (!record) {
        isNewUser = true;
        const createdRecord = new this.UsersModel({
          ...payload,
          externalUserId: payload.thirdPartyUserId,
          status: true,
          IsEmailVerified: true,
        });

        await createdRecord.save();
        record = createdRecord;

        // You can also set user-specific settings here if necessary
      }

      // Generate the JWT token
      const { createdDate, email, role, _id } = record;
      const token = this.signPayload({
        createdDate,
        email,
        role,
        userId: _id,
      });

      const decodedToken: any = decode(token);
      const { exp, iat } = decodedToken;

      return {
        success: true,
        message: 'Login successful',
        code: HttpStatus.OK,
        data: {
          userId: _id,
          isNewUser,
          role,
          email,
          dateCreated: createdDate,
          token,
          tokenInitializationDate: iat,
          tokenExpiryDate: exp,
          user: record,
        },
      };
    } catch (ex) {
      // Handle errors and log them
      console.error(ex);
      throw ex;
    }
  }

  async findUserByEmailAndPasswordAndUpdateVerificationcode(
    email: string,
    password: string,
  ): Promise<any> {
    const verificationCode = generateUniqueKey(4);
    try {
      let user = await this.UsersModel.findOne({
        email: email.toLocaleLowerCase(),
      }).exec();
      console.log(user);

      if (user && (await verifyPasswordHash(password, user.password))) {
        // Update the verification code
        user.uniqueVerificationCode = verificationCode;

        // Update Last_sign_in with the current date
        user.Last_sign_in = new Date();

        // Increment Sign_in_counts
        user.Sign_in_counts = (user.Sign_in_counts || 0) + 1;

        // Save the updated user
        await user.save();

        return {
          success: true,
          code: HttpStatus.OK,
          data: user,
          message: 'User found',
        };
      }

      throw new NotFoundException('Invalid credentials');
    } catch (ex) {
      // Handle errors as needed
      console.error('Error finding user:', ex);
      throw ex;
    }
  }

  async verifyCodeAfterSignuporLogin(
    uniqueVerificationCode: string,
    userId: string, // : Promise<BaseResponseTypeDTO>
  ) {
    try {
      const codeExists = await this.UsersModel.findOne({
        uniqueVerificationCode: uniqueVerificationCode,
      }).exec();

      if (codeExists?.id) {
        console.log(codeExists);
        if (codeExists.id !== userId) {
          throw new ForbiddenException('This code does not belong to you');
        }
        // Activate the user account
        codeExists.status = true;
        await codeExists.save();
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Code verified',
        };
      }
      throw new NotFoundException('Code was not found');
    } catch (ex) {
      throw ex;
    }
  }

  async resendOTPAfterLogin(
    userId: string, // : Promise<BaseResponseTypeDTO>
  ) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new NotFoundException('User is not valid');
      }
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const record = await this.UsersModel.findOne({ _id: userId }).exec();
      if (!record?.id) {
        throw new NotFoundException();
      }
      let token = record.uniqueVerificationCode;
      const tokenToUse = generateUniqueCode();
      // if (!token) {
      await this.UsersModel.updateOne(
        { _id: userId },
        { $set: { uniqueVerificationCode: tokenToUse } },
      );

      // }
      const htmlEmailTemplate = `
            <p>Please copy the code below to verify your account</p>
            <h3>${tokenToUse}</h3>
          `;
      await sendEmail(htmlEmailTemplate, 'Verify Account', [record.email]);
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Token has been resent',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async initiateForgotPasswordFlow(email: string) {
    try {
      const userExists = await this.UsersModel.findOne({
        email: email.toLocaleLowerCase(),
      }).exec();
      if (userExists?.id) {
        const uniqueCode = generateUniqueCode();
        await this.UsersModel.updateOne(
          { _id: userExists.id },
          { $set: { uniqueVerificationCode: uniqueCode } },
        );
        const htmlEmailTemplate = `
              <p>Please copy the code below to verify your account ownership</p>
              <h3>${uniqueCode}</h3>
            `;
        const emailResponse = await sendEmail(
          htmlEmailTemplate,
          'Verify Account Ownership',
          [email],
        );
        if (emailResponse.success) {
          return {
            ...emailResponse,
            message: 'Confirmation email sent',
          };
        }
        throw new InternalServerErrorException('Email was not sent');
      }
      throw new NotFoundException('User was not found');
    } catch (ex) {
      throw ex;
    }
  }

  async finalizeForgotPasswordFlow(uniqueVerificationCode: string) {
    try {
      const userExists = await this.UsersModel.findOne({
        uniqueVerificationCode: uniqueVerificationCode,
      }).exec();
      if (userExists?.id) {
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Unique token is valid',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async changePassword({
    uniqueVerificationCode,
    newPassword,
  }: UpdatePasswordDTO) {
    try {
      const userExists = await this.UsersModel.findOne({
        uniqueVerificationCode: uniqueVerificationCode,
      }).exec();
      if (userExists?.id) {
        const doesOldAndNewPasswordMatch = await verifyPasswordHash(
          newPassword,
          userExists.password,
        );
        if (doesOldAndNewPasswordMatch) {
          const message = 'Both old and new password match';
          throw new ConflictException(message);
        }
        const hashedPassword = await hashPassword(newPassword);

        await this.UsersModel.updateOne(
          { _id: userExists.id },
          { $set: { password: hashedPassword } },
        );

        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Password changed successfully',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async findUserById(
    userId: string | mongoose.Types.ObjectId, // :  Promise<UserResponseDTO>
  ) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new NotFoundException('User is not valid');
      }
      const data = await this.UsersModel.findOne({ _id: userId }).exec();
      if (data?.id) {
        return {
          success: true,
          code: HttpStatus.OK,
          data,
          message: 'User found',
        };
      }
      throw new NotFoundException('User not found');
    } catch (ex) {
      throw ex;
    }
  }

  
  async updateUser(
    userId: string,
    payload: UpdateUserDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      // checkForRequiredFields(['userId'], userId);
      const record = await this.UsersModel.findOne({ _id: userId });

      if (!record) {
        throw new NotFoundException(
          `User not found, therefore cannot be updated.`,
        );
      }

      if (!record?.id) {
        throw new NotFoundException('User with id not found');
      }
      // if ('enableFaceId' in payload) {
      //   record.enableFaceId = payload.enableFaceId;
      // }
      if ('allowEmailNotifications' in payload) {
        record.allowEmailNotifications = payload.allowEmailNotifications;
      }
      if ('allowSmsNotifications' in payload) {
        record.allowSmsNotifications = payload.allowSmsNotifications;
      }
      if ('allowPushNotifications' in payload) {
        record.allowPushNotifications = payload.allowPushNotifications;
      }
      // if (payload.dob && record.dob !== payload.dob) {
      //   validatePastDate(payload.dob, 'dob');
      //   record.dob = payload.dob;
      // }
      if (payload.phoneNumber && payload.phoneNumber !== record.phoneNumber) {
        record.phoneNumber = payload.phoneNumber;
      }
      if (payload.email && payload.email !== record.email) {
        validateEmailField(payload.email);
        record.email = payload.email.toUpperCase();
      }
      if (payload.firstName && payload.firstName !== record.firstName) {
        record.firstName = payload.firstName.toUpperCase();
      }
      if (payload.lastName && payload.lastName !== record.lastName) {
        record.lastName = payload.lastName.toUpperCase();
      }
      // if (payload.gender && payload.gender !== record.gender) {
      //   compareEnumValueFields(payload.gender, Object.values(Gender), 'gender');
      //   record.gender = payload.gender;
      // }
      // if (payload.password) {
      //   record.password = await hashPassword(payload.password);
      // }
      if (
        payload.profileImageUrl &&
        payload.profileImageUrl !== record.profileImageUrl
      ) {
        validateURLField(payload.profileImageUrl, 'profileImageUrl');
        record.profileImageUrl = payload.profileImageUrl;
      }

         // Academic Background
    if (payload.highestEducation && payload.highestEducation !== record.highestEducation) {
      record.highestEducation = payload.highestEducation;
    }
    if (payload.fieldsOfStudy && JSON.stringify(payload.fieldsOfStudy) !== JSON.stringify(record.fieldsOfStudy)) {
      record.fieldsOfStudy = payload.fieldsOfStudy;
    }
    if (payload.universityOrInstitution && payload.universityOrInstitution !== record.universityOrInstitution) {
      record.universityOrInstitution = payload.universityOrInstitution;
    }

    // Career Interests
    if (payload.industriesOfInterest && JSON.stringify(payload.industriesOfInterest) !== JSON.stringify(record.industriesOfInterest)) {
      record.industriesOfInterest = payload.industriesOfInterest;
    }
    if (payload.currentJobTitle && payload.currentJobTitle !== record.currentJobTitle) {
      record.currentJobTitle = payload.currentJobTitle;
    }
    if (payload.careerExperience && payload.careerExperience !== record.careerExperience) {
      record.careerExperience = payload.careerExperience;
    }

    // Hobbies & Skills
    if (payload.hobbies && JSON.stringify(payload.hobbies) !== JSON.stringify(record.hobbies)) {
      record.hobbies = payload.hobbies;
    }
    if (payload.skills && JSON.stringify(payload.skills) !== JSON.stringify(record.skills)) {
      record.skills = payload.skills;
    }

    // Future Aspirations
    if (payload.futureAspirations && payload.futureAspirations !== record.futureAspirations) {
      record.futureAspirations = payload.futureAspirations;
    }
  
      const updatedUser = await record.save();
      return {
        // data:updatedUser,
        success: true,
        code: HttpStatus.OK,
        message: 'Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

}
