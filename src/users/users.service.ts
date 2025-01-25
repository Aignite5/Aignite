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
  UserDto,

} from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
} from 'src/utils/utils.function';
import { UpdatePasswordDTO } from 'src/utils/utils.types';
import { decode, sign } from 'jsonwebtoken';
import { ThirdPartyLoginDTO } from 'src/auth/dto/auth.dto';
import { AppRole, AuthProvider } from 'src/utils/utils.constant';
import { Users } from './schema/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private signPayload<T extends string | object | Buffer>(payload: T): string {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  constructor(
    @InjectModel(Users.name) private readonly UsersModel: Model<Users>,
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
}
