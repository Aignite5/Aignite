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
  CreateMentorDto,
  CreateUserDto,
  UpdatePlanPricesDto,
  UpdateProgressDto,
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
import { Cron, CronExpression } from '@nestjs/schedule';
import { Progress } from './schema/progress.schema';
import { UpdateMentorshipProfileDto } from './dto/mentorship.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private signPayload<T extends string | object | Buffer>(payload: T): string {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  constructor(
    @InjectModel(Users.name) private readonly UsersModel: Model<Users>,
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
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
        email: email.toLowerCase(),
      }).exec();

      if (user && (await verifyPasswordHash(password, user.password))) {
        // Update the verification code
        user.uniqueVerificationCode = verificationCode;

        // Update Last_sign_in with the current date
        user.Last_sign_in = new Date();

        // Increment Sign_in_counts
        user.Sign_in_counts = (user.Sign_in_counts || 0) + 1;

        // Save the updated user
        await user.save();

        // If user status is false, send a verification email
        if (!user.status) {
          const htmlEmailTemplate = `
          <p>Please copy the code below to verify your account</p>
          <h3>${verificationCode}</h3>
        `;
          await sendEmail(htmlEmailTemplate, 'Verify Account', [user.email]);
          return {
            success: true,
            code: user,
            message: 'Token has been resent',
          };
        }

        return {
          success: true,
          code: HttpStatus.OK,
          data: user,
          message: 'User found',
        };
      }

      throw new NotFoundException('Invalid credentials');
    } catch (ex) {
      console.error('Error finding user:', ex);
      throw ex;
    }
  }

  // async findUserByEmailAndPasswordAndUpdateVerificationcode(
  //   email: string,
  //   password: string,
  // ): Promise<any> {
  //   const verificationCode = generateUniqueKey(4);
  //   try {
  //     let user = await this.UsersModel.findOne({
  //       email: email.toLocaleLowerCase(),
  //     }).exec();
  //     console.log(user);

  //     if (user && (await verifyPasswordHash(password, user.password))) {
  //       // Update the verification code
  //       user.uniqueVerificationCode = verificationCode;

  //       // Update Last_sign_in with the current date
  //       user.Last_sign_in = new Date();

  //       // Increment Sign_in_counts
  //       user.Sign_in_counts = (user.Sign_in_counts || 0) + 1;

  //       // Save the updated user
  //       await user.save();

  //       return {
  //         success: true,
  //         code: HttpStatus.OK,
  //         data: user,
  //         message: 'User found',
  //       };
  //     }

  //     throw new NotFoundException('Invalid credentials');
  //   } catch (ex) {
  //     // Handle errors as needed
  //     console.error('Error finding user:', ex);
  //     throw ex;
  //   }
  // }

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

  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  async getUserBlueprintById(userId: string) {
    const user = await this.UsersModel.findById(userId)
      .select('careerBlueprint')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return { success: true, userId, careerBlueprint: user.careerBlueprint };
  }

  async getFormattedUserBlueprintById(userId: string) {
    const user = await this.UsersModel.findById(userId)
      .select('careerBlueprint')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const formatted = this.formatCareerBlueprint(user.careerBlueprint);
    return { success: true, userId, careerBlueprint: formatted };
  }

  async getBlueprintForSharing(userId: string) {
    const user = await this.UsersModel.findById(userId)
      .select('careerBlueprint firstName lastName profilePic email')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const formatted = this.formatCareerBlueprint(user.careerBlueprint);

    return {
      success: true,
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePic: user.profilePic,
      email: user.email,
      careerBlueprint: formatted,
    };
  }

  formatCareerBlueprint(content: string) {
    const extractSection = (label: string) => {
      const regex = new RegExp(
        `\\*\\*${label}\\*\\*\\s*:?\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n###|\\n---|$)`,
      );
      const match = content.match(regex);
      return match ? match[1].trim() : '';
    };

    const extractJson = () => {
      const jsonMatch = content.match(/```json([\s\S]*?)```/);
      try {
        return jsonMatch ? JSON.parse(jsonMatch[1].trim()) : null;
      } catch (e) {
        return null;
      }
    };

    return {
      structuredJson: extractJson(),
    };
  }

  async updateUserProgress(userId: string, dto: UpdateProgressDto) {
    const user = await this.UsersModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    let progress = await this.progressModel.findOne({ userId });

    if (!progress) {
      // Create progress record if not found
      progress = await this.progressModel.create({ userId });
    }

    const fields = [
      'year1',
      'year2',
      'year3',
      'year4',
      'year5',
      'tasks',
      'projects',
    ];

    for (const field of fields) {
      const dtoValues: string[] = dto[field];
      if (Array.isArray(dtoValues)) {
        const currentValues: string[] = progress[field] || [];
        const newUniqueValues = dtoValues.filter(
          (item) => !currentValues.includes(item),
        );
        progress[field] = [...currentValues, ...newUniqueValues];
      }
    }

    await progress.save();

    return {
      success: true,
      message: 'Progress updated successfully',
      data: progress,
    };
  }

  // async updateUserProgress(userId: string, dto: UpdateProgressDto) {
  //   const user = await this.UsersModel.findById(userId);
  //   if (!user) throw new NotFoundException('User not found');

  //   const progress = await this.progressModel.findOneAndUpdate(
  //     { userId },
  //     { $set: dto },
  //     { new: true, upsert: true },
  //   );

  //   return {
  //     success: true,
  //     message: 'Progress updated successfully',
  //     data: progress,
  //   };
  // }

  extractStructuredJson(aiResponse: string) {
    try {
      const jsonMatch = aiResponse.match(/```json([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1].trim());
      }
    } catch (error) {
      console.error('Failed to parse structured JSON from blueprint');
    }
    return {};
  }

  calculateCompletionPercentage(progress: any, blueprint: any) {
    const calc = (done: string[], total: string[]) => {
      if (!total?.length) return 0;
      const matched = done.filter((item) => total.includes(item)).length;
      return Math.round((matched / total.length) * 100);
    };

    return {
      // tasksCompleted: calc(progress.tasks || [], blueprint.tasks || []),
      // projectsCompleted: calc(progress.projects || [], blueprint.projects || []),
      year1MilestonesCompleted: calc(
        progress.year1 || [],
        blueprint.fiveYearRoadmap?.year1 || [],
      ),
      year2MilestonesCompleted: calc(
        progress.year2 || [],
        blueprint.fiveYearRoadmap?.year2 || [],
      ),
      year3MilestonesCompleted: calc(
        progress.year3 || [],
        blueprint.fiveYearRoadmap?.year3 || [],
      ),
      year4FMilestonesCompleted: calc(
        progress.year4 || [],
        blueprint.fiveYearRoadmap?.year4 || [],
      ),
      year5MilestonesCompleted: calc(
        progress.year5 || [],
        blueprint.fiveYearRoadmap?.year5 || [],
      ),
    };
  }
  async getUserProgress(userId: string) {
    const user = await this.UsersModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const progress = (await this.progressModel.findOne({ userId })) || {};
    const blueprintRaw = user?.careerBlueprint;

    let completionStats = null;

    if (blueprintRaw) {
      const parsed = this.extractStructuredJson(blueprintRaw);
      completionStats = this.calculateCompletionPercentage(progress, parsed);
    }

    return {
      success: true,
      message: 'User progress retrieved successfully',
      data: {
        progress,
        completionStats,
      },
    };
  }

  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
  ////////////////////////////////////////////BLUEPRINT////////////////////////////////
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
      if (
        payload.highestLevelOfEducation &&
        payload.highestLevelOfEducation !== record.highestLevelOfEducation
      ) {
        record.highestLevelOfEducation = payload.highestLevelOfEducation;
      }
      if (
        payload.fieldOfStudy &&
        JSON.stringify(payload.fieldOfStudy) !==
          JSON.stringify(record.fieldOfStudy)
      ) {
        record.fieldOfStudy = payload.fieldOfStudy;
      }
      if (
        payload.universityOrInstitution &&
        payload.universityOrInstitution !== record.universityOrInstitution
      ) {
        record.universityOrInstitution = payload.universityOrInstitution;
      }

      // Career Interests
      if (
        payload.industriesOfInterest &&
        JSON.stringify(payload.industriesOfInterest) !==
          JSON.stringify(record.industriesOfInterest)
      ) {
        record.industriesOfInterest = payload.industriesOfInterest;
      }
      if (
        payload.currentJobTitle &&
        payload.currentJobTitle !== record.currentJobTitle
      ) {
        record.currentJobTitle = payload.currentJobTitle;
      }
      if (
        payload.careerExperience &&
        payload.careerExperience !== record.careerExperience
      ) {
        record.careerExperience = payload.careerExperience;
      }

      if (
        payload.Carreer_Dream &&
        payload.Carreer_Dream !== record.Carreer_Dream
      ) {
        record.Carreer_Dream = payload.Carreer_Dream;
      }

      if (
        payload.Career_goals &&
        payload.Career_goals !== record.Career_goals
      ) {
        record.Career_goals = payload.Career_goals;
      }

      if (
        payload.Skill_developement_strategies &&
        payload.Skill_developement_strategies !==
          record.Skill_developement_strategies
      ) {
        record.Skill_developement_strategies =
          payload.Skill_developement_strategies;
      }

      // Hobbies & Skills
      if (
        payload.hobbies &&
        JSON.stringify(payload.hobbies) !== JSON.stringify(record.hobbies)
      ) {
        record.hobbies = payload.hobbies;
      }
      if (
        payload.skills &&
        JSON.stringify(payload.skills) !== JSON.stringify(record.skills)
      ) {
        record.skills = payload.skills;
      }

      // Future Aspirations
      if (
        payload.futureAspirations &&
        payload.futureAspirations !== record.futureAspirations
      ) {
        record.futureAspirations = payload.futureAspirations;
      }
      // Academic Background
      if (
        payload.highestLevelOfEducation &&
        payload.highestLevelOfEducation !== record.highestLevelOfEducation
      ) {
        record.highestLevelOfEducation = payload.highestLevelOfEducation;
      }
      if (
        payload.fieldOfStudy &&
        JSON.stringify(payload.fieldOfStudy) !==
          JSON.stringify(record.fieldOfStudy)
      ) {
        record.fieldOfStudy = payload.fieldOfStudy;
      }
      if (
        payload.universityOrInstitution &&
        payload.universityOrInstitution !== record.universityOrInstitution
      ) {
        record.universityOrInstitution = payload.universityOrInstitution;
      }

      // Career Interests & Work Experience
      if (
        payload.currentStatus &&
        payload.currentStatus !== record.currentStatus
      ) {
        record.currentStatus = payload.currentStatus;
      }
      if (
        payload.industriesOfInterest &&
        JSON.stringify(payload.industriesOfInterest) !==
          JSON.stringify(record.industriesOfInterest)
      ) {
        record.industriesOfInterest = payload.industriesOfInterest;
      }
      if (
        payload.currentJobTitle &&
        payload.currentJobTitle !== record.currentJobTitle
      ) {
        record.currentJobTitle = payload.currentJobTitle;
      }
      if (
        payload.careerExperience &&
        payload.careerExperience !== record.careerExperience
      ) {
        record.careerExperience = payload.careerExperience;
      }
      if (
        payload.workExperience &&
        payload.workExperience !== record.workExperience
      ) {
        record.workExperience = payload.workExperience;
      }
      if (
        payload.excitingWork &&
        payload.excitingWork !== record.excitingWork
      ) {
        record.excitingWork = payload.excitingWork;
      }

      if (payload.ageRange && payload.ageRange !== record.ageRange) {
        record.ageRange = payload.ageRange;
      }

      // Skills
      if (
        payload.technicalSkills &&
        JSON.stringify(payload.technicalSkills) !==
          JSON.stringify(record.technicalSkills)
      ) {
        record.technicalSkills = payload.technicalSkills;
      }
      if (
        payload.softSkills &&
        JSON.stringify(payload.softSkills) !== JSON.stringify(record.softSkills)
      ) {
        record.softSkills = payload.softSkills;
      }

      // Preferences
      if (
        payload.preferredWorkEnvironments &&
        JSON.stringify(payload.preferredWorkEnvironments) !==
          JSON.stringify(record.preferredWorkEnvironments)
      ) {
        record.preferredWorkEnvironments = payload.preferredWorkEnvironments;
      }
      if (
        payload.learningPreferences &&
        JSON.stringify(payload.learningPreferences) !==
          JSON.stringify(record.learningPreferences)
      ) {
        record.learningPreferences = payload.learningPreferences;
      }
      if (
        payload.careerChallenges &&
        JSON.stringify(payload.careerChallenges) !==
          JSON.stringify(record.careerChallenges)
      ) {
        record.careerChallenges = payload.careerChallenges;
      }

      // Future Aspirations & Additional Info
      if (
        payload.futureAspirations &&
        payload.futureAspirations !== record.futureAspirations
      ) {
        record.futureAspirations = payload.futureAspirations;
      }
      if (
        payload.additionalInfo &&
        payload.additionalInfo !== record.additionalInfo
      ) {
        record.additionalInfo = payload.additionalInfo;
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

  async updateMentorshipAndProfessionalInfo(
    userId: string,
    dto: UpdateMentorshipProfileDto,
  ): Promise<any> {
    const user = await this.UsersModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const updatableFields = [
      'linkedInUrl',
      'professionalTitle',
      'shortBio',
      'fieldsOfExpertise',
      'careerLevelsSupported',
      'supportTypes',
      'mentorshipStyle',
      'availabilityPerWeek',
      'bestDaysAndTimes',
      'offersPaidMentorship',
      'monthlyPrice',
      'cancellationPolicy',
    ];

    for (const field of updatableFields) {
      if (dto[field] !== undefined) {
        user[field] = dto[field];
      }
    }

    await user.save();
    return {
      // data:updatedUser,
      success: true,
      code: HttpStatus.OK,
      message: 'Updated',
    };
  }

   async toggleMentorVerificationStatus(
    userId: string,
    status: boolean,
  ): Promise<any> {
    const user = await this.UsersModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.mentorVerificationStatus = status;
    await user.save();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Mentor has been ${status ? 'activated' : 'deactivated'}`,
      data: {
        userId: user._id,
        mentorVerificationStatus: user.mentorVerificationStatus,
      },
    };
  }

  async updateUserPlanPrices(userId: string, dto: UpdatePlanPricesDto) {
    const user = await this.UsersModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.LitePlanPrice = dto.LitePlanPrice;
    user.StandardPlanPrice = dto.StandardPlanPrice;

    await user.save();

    return {
      success: true,
      message: 'User plan prices updated successfully',
      data: {
        userId: user._id,
        LitePlanPrice: user.LitePlanPrice,
        StandardPlanPrice: user.StandardPlanPrice,
      },
    };
  }

  async promoteAllStudentsToMentors() {
    const result = await this.UsersModel.updateMany(
      { role: 'STUDENT' },
      { $set: { role: 'Talent' } },
    );

    return {
      success: true,
      message: `${result.modifiedCount} users promoted to talents.`,
    };
  }

  @Cron(CronExpression.EVERY_WEEK)
  async remindUsersToCompleteProfile() {
    const users = await this.UsersModel.find({
      $or: [
        { highestLevelOfEducation: { $exists: false, $eq: null } },
        { fieldOfStudy: { $exists: false, $eq: [] } },
        { universityOrInstitution: { $exists: false, $eq: null } },
        { industriesOfInterest: { $exists: false, $eq: [] } },
        { currentJobTitle: { $exists: false, $eq: null } },
        { careerExperience: { $exists: false, $eq: null } },
        { hobbies: { $exists: false, $eq: [] } },
        { skills: { $exists: false, $eq: [] } },
        { futureAspirations: { $exists: false, $eq: null } },
      ],
    });

    if (users.length === 0) {
      console.log('✅ No users to remind.');
      return;
    }

    for (const user of users) {
      if (!user.email) continue; // Skip users without email

      // Identify missing fields dynamically
      const missingFields = [];
      if (!user.highestLevelOfEducation)
        missingFields.push('Highest Education');
      if (!user.fieldOfStudy || user.fieldOfStudy.length === 0)
        missingFields.push('Fields of Study');
      if (!user.universityOrInstitution)
        missingFields.push('University/Institution');
      if (!user.industriesOfInterest || user.industriesOfInterest.length === 0)
        missingFields.push('Industries of Interest');
      if (!user.currentJobTitle) missingFields.push('Current Job Title');
      if (!user.careerExperience) missingFields.push('Career Experience');
      if (!user.hobbies || user.hobbies.length === 0)
        missingFields.push('Hobbies');
      if (!user.skills || user.skills.length === 0)
        missingFields.push('Skills');
      if (!user.futureAspirations) missingFields.push('Future Aspirations');

      const emailTemplate = `
        <p>Dear ${user.firstName || 'User'},</p>
        <h3>🚀 Complete Your Profile to Get Your Personalized Career Blueprint</h3>
        <p>We noticed that your profile is missing some important details. Completing these fields will help us generate a tailored career blueprint for you.</p>
        <p><strong>📝 Missing Fields:</strong></p>
        <ul>
          ${missingFields.map((field) => `<li>${field}</li>`).join('')}
        </ul>
        <p>Click below to update your profile:</p>
        <a href="https://yourapp.com/profile/edit" style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Update Profile</a>
        <p>Thank you!</p>
      `;

      await sendEmail(emailTemplate, 'Complete Your Profile', [user.email]);
      console.log(`📧 Reminder email sent to ${user.email}`);
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async SocketremindUsersToCompleteProfile() {
  //   const users = await this.UsersModel.find({
  //     $or: [
  //       { highestLevelOfEducation: { $exists: false, $eq: null } },
  //       { fieldOfStudy: { $exists: false, $eq: [] } },
  //       { universityOrInstitution: { $exists: false, $eq: null } },
  //       { industriesOfInterest: { $exists: false, $eq: [] } },
  //       { currentJobTitle: { $exists: false, $eq: null } },
  //       { careerExperience: { $exists: false, $eq: null } },
  //       { hobbies: { $exists: false, $eq: [] } },
  //       { skills: { $exists: false, $eq: [] } },
  //       { futureAspirations: { $exists: false, $eq: null } },
  //     ]
  //   });

  //   if (users.length === 0) {
  //     console.log('✅ No users to remind.');
  //     return;
  //   }

  //   for (const user of users) {
  //     if (!user.email) continue;

  //     // Identify missing fields dynamically
  //     const missingFields = [];
  //     if (!user.highestLevelOfEducation) missingFields.push('Highest Education');
  //     if (!user.fieldOfStudy || user.fieldOfStudy.length === 0) missingFields.push('Fields of Study');
  //     if (!user.universityOrInstitution) missingFields.push('University/Institution');
  //     if (!user.industriesOfInterest || user.industriesOfInterest.length === 0) missingFields.push('Industries of Interest');
  //     if (!user.currentJobTitle) missingFields.push('Current Job Title');
  //     if (!user.careerExperience) missingFields.push('Career Experience');
  //     if (!user.hobbies || user.hobbies.length === 0) missingFields.push('Hobbies');
  //     if (!user.skills || user.skills.length === 0) missingFields.push('Skills');
  //     if (!user.futureAspirations) missingFields.push('Future Aspirations');

  //     // Prepare the notification message
  //     const notificationMessage = `🔔 Reminder: Please complete your profile. Missing fields: ${missingFields.join(', ')}`;

  //     // Send real-time socket notification
  //     this.notificationsGateway.sendNotification(user.email, {
  //       title: 'Complete Your Profile',
  //       message: notificationMessage,
  //       actionUrl: 'https://yourapp.com/profile/edit',
  //     });

  //     // Send email reminder
  //     const emailTemplate = `
  //       <p>Dear ${user.firstName || 'User'},</p>
  //       <h3>🚀 Complete Your Profile to Get Your Personalized Career Blueprint</h3>
  //       <p>We noticed that your profile is missing some important details. Completing these fields will help us generate a tailored career blueprint for you.</p>
  //       <p><strong>📝 Missing Fields:</strong></p>
  //       <ul>
  //         ${missingFields.map(field => `<li>${field}</li>`).join('')}
  //       </ul>
  //       <p>Click below to update your profile:</p>
  //       <a href="https://yourapp.com/profile/edit" style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Update Profile</a>
  //       <p>Thank you!</p>
  //     `;

  //     await sendEmail(emailTemplate, 'Complete Your Profile', [user.email]);
  //     console.log(`📧 Reminder email & 📡 Socket notification sent to ${user.email}`);
  //   }
  // }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await this.UsersModel.find().skip(skip).limit(limit).exec();
    const totalUsers = await this.UsersModel.countDocuments();
    return {
      success: true,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    };
  }

  async createMentor(dto: CreateMentorDto) {
    const existing = await this.UsersModel.findOne({ email: dto.email });

    if (existing) {
      throw new ConflictException('Mentor with this email already exists.');
    }

    const mentor = new this.UsersModel({ ...dto, role: 'Mentor' });
    await mentor.save();

    return {
      success: true,
      message: 'Mentor created successfully',
      data: mentor,
    };
  }

  async getAllMentors(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const mentors = await this.UsersModel.find({ role: 'Mentor' })
      .select('firstName lastName email specialty profileImageUrl mentorVerificationStatus')
      .skip(skip)
      .limit(limit)
      .exec();

    const totalMentors = await this.UsersModel.countDocuments({
      role: 'Mentor',
    });

    return {
      success: true,
      totalMentors,
      totalPages: Math.ceil(totalMentors / limit),
      currentPage: page,
      mentors,
    };
  }

  async getAllUsersSearch(
    page: number = 1,
    limit: number = 10,
    searchQuery?: string,
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Enable wildcard search on firstName, lastName, email, and phoneNumber
    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phoneNumber: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Fetch users
    const users = await this.UsersModel.find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    // Count total users that match the search (for pagination)
    const total = await this.UsersModel.countDocuments(query).exec();

    return {
      success: true,
      total,
      page,
      limit,
      data: users,
    };
  }

  async countRegisteredUsersPerDay(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const results = await this.UsersModel.aggregate([
      {
        $match: {
          createdDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      success: true,
      data: results,
    };
  }

  async getWeeklyUserGrowth() {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 14); // 2 weeks ago
    const lastWeekEnd = new Date(today);
    lastWeekEnd.setDate(today.getDate() - 7); // 1 week ago

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 7); // Start of this week
    const thisWeekEnd = today;

    const [lastWeek, thisWeek] = await Promise.all([
      this.UsersModel.countDocuments({
        createdDate: { $gte: lastWeekStart, $lte: lastWeekEnd },
      }),
      this.UsersModel.countDocuments({
        createdDate: { $gte: thisWeekStart, $lte: thisWeekEnd },
      }),
    ]);

    if (lastWeek === 0) {
      return {
        success: true,
        percentageChange: thisWeek > 0 ? 100 : 0,
        message: 'No users registered last week for comparison.',
      };
    }

    const percentageChange = ((thisWeek - lastWeek) / lastWeek) * 100;

    return {
      success: true,
      lastWeek,
      thisWeek,
      percentageChange,
      message: `User registration has ${percentageChange >= 0 ? 'increased' : 'decreased'} %`,
    };
  }

  async getUsersWithIncompleteAcademicBackground(
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const users = await this.UsersModel.find({
      $or: [
        { highestLevelOfEducation: { $exists: false, $eq: null } },
        { fieldOfStudy: { $exists: false, $size: 0 } },
        { universityOrInstitution: { $exists: false, $eq: null } },
      ],
    })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalUsers = await this.UsersModel.countDocuments({
      $or: [
        { highestLevelOfEducation: { $exists: false, $eq: null } },
        { fieldOfStudy: { $exists: false, $size: 0 } },
        { universityOrInstitution: { $exists: false, $eq: null } },
      ],
    });

    return {
      success: true,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    };
  }

  async deleteUserById(userId: string) {
    const user = await this.UsersModel.findByIdAndDelete(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return { success: true, message: 'User deleted successfully' };
  }

  /**
   * 📌 Suspend or unsuspend a user
   */
  async updateUserStatus(userId: string, status: boolean) {
    const user = await this.UsersModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true },
    ).exec();
    if (!user) throw new NotFoundException('User not found');
    return {
      success: true,
      message: status
        ? 'User suspended successfully'
        : 'User unsuspended successfully',
      data: user,
    };
  }

  /**
   * 📌 Get each user's login count
   */
  async getUserLoginCounts() {
    const users = await this.UsersModel.find(
      {},
      { firstName: 1, lastName: 1, email: 1, sign_in_counts: 1 },
    ).exec();
    return { success: true, total: users.length, data: users };
  }
}
