import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AppRole } from 'src/utils/utils.constant';

export class CreateAccountDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '099998877', description: 'User phone number' })
  @IsNotEmpty()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'USER',
    description: 'User role',
    enum: AppRole,
    default: AppRole.USER,
  })
  @IsOptional()
  @IsEnum(AppRole, { message: 'Role must be one of USER, ADMIN, or MODERATOR' })
  role: AppRole;

  @ApiProperty({
    example: '1990-05-15',
    description: 'User date of birth in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'date_of_birth must be a valid ISO date string' },
  )
  date_of_birth?: Date;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}


export class UserDto {
    @ApiProperty({ example: 'John', description: 'User first name' })
    firstName: string;
  
    @ApiProperty({ example: 'Doe', description: 'User last name' })
    lastName: string;
  
    @ApiProperty({
      example: 'https://example.com/profile.jpg',
      description: 'Profile picture URL',
    })
    profilePic: string;
  
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    email: string;
  
    @ApiProperty({
      example: '2000-01-01',
      description: 'User date of birth',
      type: Date,
    })
    date_of_birth: Date;
  
    @ApiProperty({ example: '123 Main Street', description: 'User address' })
    address: string;
  
    @ApiProperty({ example: '+1234567890', description: 'User phone number' })
    phoneNumber: string;
  
    @ApiProperty({ example: 'USER', description: 'User role', enum: ['USER', 'ADMIN'] })
    role: string;
  
    @ApiProperty({ example: 'Nigeria', description: 'User country' })
    Country: string;
  
    @ApiProperty({ example: false, description: 'User status' })
    status: boolean;
  
    @ApiProperty({
      example: '1234',
      description: 'Unique verification code for user authentication',
    })
    uniqueVerificationCode: string;
  
    @ApiProperty({
      example: '2024-01-01T00:00:00.000Z',
      description: 'Last sign-in date',
      type: Date,
    })
    Last_sign_in: Date;
  
    @ApiProperty({
      example: 5,
      description: 'Count of how many times the user has signed in',
    })
    Sign_in_counts: number;
  }

export class CreateUserDto {}
