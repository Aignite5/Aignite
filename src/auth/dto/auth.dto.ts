import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '../../utils/utils.types';
import { AppRole, AuthProvider } from '../../utils/utils.constant';
import { IsNotEmpty, IsString } from 'class-validator';
// import { User } from '@entities/index';

export class AuthResponse {
    @ApiProperty()
    userId: string;

    @ApiProperty({
        enum: AppRole,
    })
    role: AppRole;

    @ApiProperty()
    token: string;

    //   @ApiProperty({ type: User })
    //   user: User;
}

export class SignUpDTO {
    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export class LoginUserDTO {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export class LoginPhoneUserDTO {
    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    password: string;
}

export class OTPUserDTO {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    uniqueVerificationCode: string;
}

export class ThirdPartyLoginDTO {
    @ApiProperty({
        description:
            'UserId or any other unique identifier assigned by google or facebook',
    })
    thirdPartyUserId: string;

    @ApiProperty({ enum: AuthProvider })
    provider: AuthProvider;

    @ApiProperty({ nullable: true, description: 'Nullable' })
    profileImageUrl: string;

    @ApiProperty({ nullable: true, description: 'Nullable' })
    email: string;

    @ApiProperty({ example: 'John', description: 'User first name' })
    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @ApiProperty({ example: 'Doe', description: 'User last name' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ nullable: true, description: 'Nullable' })
    phoneNumber?: string;
}

export class AuthUserDataDTO {
    @ApiProperty({ description: 'User ID' })
    userId: string;
  
    @ApiProperty({ description: 'Indicates if this is a new user' })
    isNewUser: boolean;
  
    @ApiProperty({ description: 'Indicates if profile data is set' })
    isProfileDataSet: boolean;
  
    @ApiProperty({ description: 'User role' })
    role: string;
  
    @ApiProperty({ description: 'User email address' })
    email: string;
  
    @ApiProperty({ description: 'Date the user was created' })
    dateCreated: Date;
  
    @ApiProperty({ description: 'JWT token' })
    token: string;
  
    @ApiProperty({ description: 'Token initialization date' })
    tokenInitializationDate: number;
  
    @ApiProperty({ description: 'Token expiry date' })
    tokenExpiryDate: number;
  
    @ApiProperty({ description: 'Complete user record' })
    user: any; // You can replace `any` with a specific User DTO if needed
  }

export class ThirdPartyAuthResponseDTO {
    @ApiProperty({ description: 'Indicates if the operation was successful' })
    success: boolean;
  
    @ApiProperty({ description: 'Response message' })
    message: string;
  
    @ApiProperty({ description: 'HTTP status code' })
    code: number;
  
    @ApiProperty({
      description: 'Data returned from the login process',
      type: () => AuthUserDataDTO,
    })
    data: AuthUserDataDTO;
  }

export class AuthResponseDTO extends BaseResponseTypeDTO {
    @ApiProperty()
    data: AuthResponse;
}
