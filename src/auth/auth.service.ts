import {
  Injectable,
  HttpStatus,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  checkForRequiredFields,
  validateEmailField,
  encryptData,
  hashPassword,
  generateUniqueKey,
  sendEmail,
} from '../utils/utils.function';
import { LoginUserDTO} from './dto/auth.dto';
import { sign } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import {
  CreateAccountDto,
} from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    // private readonly AdminSrv: AdminsService,
    private readonly UserSrv: UsersService,
  ) {}

  private signPayload<T extends string | object | Buffer>(payload: T): string {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  async GlobalLevelUsersignUp(payload: CreateAccountDto) {
    // : Promise<AuthResponseDTO>
    try {
      // checkForRequiredFields(['provider', 'thirdPartyUserId'], payload);
      if (payload.email) {
        validateEmailField(payload.email);
      }

      let password = await hashPassword(payload.password ?? '12345');
      let record = await this.UserSrv.createuser({
        ...payload,
        password,
        // whatPassportDoYouHave: payload.whatPassportDoYouHave,
        // whatVisaDoYouHave: payload.whatVisaDoYouHave,
        // whatResidentPermitDoYouHave: payload.whatResidentPermitDoYouHave,
      });

      const { email, uniqueVerificationCode, role } = record;
      const payloadToSign = encryptData(
        JSON.stringify({
          user: record,
          email,
          role,
        }),
        process.env.ENCRYPTION_KEY,
      );
      const token = this.signPayload({ data: payloadToSign });
      const htmlEmailTemplate = `
        <h2>Please copy the code below to verify your account</h2>
        <h3>${uniqueVerificationCode}</h3>
      `;

     await sendEmail(htmlEmailTemplate, 'Verify Account', [email]);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'User Logged in',
        data: {
          user: record,
          token,
        },
      };
    } catch (ex) {
      throw ex;
    }
  }



  async Userlogin(payload: LoginUserDTO) {
    // : Promise<AuthResponseDTO>
    try {
      checkForRequiredFields(['email', 'password'], payload);
      validateEmailField(payload.email);
      const user =
        await this.UserSrv.findUserByEmailAndPasswordAndUpdateVerificationcode(
          payload.email,
          payload.password,
        );
      if (user?.data.id) {
        const {
          data: {
            // dateCreated,
            email,
            role,
            id,
          },
        } = user;
        const payloadToSign = encryptData(
          JSON.stringify({
            user: user.data,
            // dateCreated,
            email,
            role,
            // role,
            id,
          }),
          process.env.ENCRYPTION_KEY,
        );
        const token = this.signPayload({ data: payloadToSign });
        const htmlEmailTemplate = `
          <h2>Please copy the code below to login</h2>
          <h3>${user.data.uniqueVerificationCode}</h3>
        `;

        //  await sendEmail(htmlEmailTemplate, 'Verify Account', [email]);

        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Logged in',
          data: {
            userId: id,
            // role,
            user: user.data,
            token,
          },
        };
      }
      throw new NotFoundException('Invalid credentials');
    } catch (ex) {
      // this.logger.log(ex);
      throw ex;
    }
  }
}
