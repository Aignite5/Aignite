import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
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

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
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

  @ApiProperty({
    example: 'USER',
    description: 'User role',
    enum: ['USER', 'ADMIN'],
  })
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

  @ApiProperty()
  profileImageUrl: string;

  @ApiProperty()
  allowPushNotifications: boolean;

  @ApiProperty()
  allowSmsNotifications: boolean;

  @ApiProperty()
  allowEmailNotifications: boolean;
}

// export class updateUserDto extends UserDto {}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg', description: 'User profile picture URL' })
  @IsOptional()
  @IsString()
  profilePic?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'User email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '1995-08-15', description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsDate()
  date_of_birth?: Date;

  @ApiPropertyOptional({ example: '123 Main Street, City, Country', description: 'User address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Nigeria', description: 'Country of residence' })
  @IsOptional()
  @IsString()
  Country?: string;

  // @ApiPropertyOptional({ example: AppRole.USER, enum: AppRole, description: 'User role' })
  // @IsOptional()
  // role?: AppRole;

  // @ApiPropertyOptional({ example: false, description: 'Account status (active/inactive)' })
  // @IsOptional()
  // @IsBoolean()
  // status?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Allow push notifications' })
  @IsOptional()
  @IsBoolean()
  allowPushNotifications?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Allow SMS notifications' })
  @IsOptional()
  @IsBoolean()
  allowSmsNotifications?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Allow email notifications' })
  @IsOptional()
  @IsBoolean()
  allowEmailNotifications?: boolean;

  @ApiProperty()
  profileImageUrl: string;

  // Academic Background
  @ApiPropertyOptional({ example: "Bachelor's Degree", description: 'Highest level of education' })
  @IsOptional()
  @IsString()
  highestEducation?: string;

  @ApiPropertyOptional({ example: ['Engineering', 'Computer Science'], description: 'Fields of study' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fieldsOfStudy?: string[];

  @ApiPropertyOptional({ example: 'Harvard University', description: 'University or institution attended' })
  @IsOptional()
  @IsString()
  universityOrInstitution?: string;

  // Career Interests
  @ApiPropertyOptional({ example: ['Technology', 'Finance'], description: 'Industries of interest' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  industriesOfInterest?: string[];

  @ApiPropertyOptional({ example: 'Software Engineer', description: 'Current job title' })
  @IsOptional()
  @IsString()
  currentJobTitle?: string;

  @ApiPropertyOptional({ example: '5 years experience in web development', description: 'Career experience details' })
  @IsOptional()
  @IsString()
  careerExperience?: string;

  // Hobbies and Skills
  @ApiPropertyOptional({ example: ['Coding', 'Football'], description: 'User hobbies' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hobbies?: string[];

  @ApiPropertyOptional({ example: ['JavaScript', 'Python'], description: 'User skills' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  // Future Aspirations
  @ApiPropertyOptional({ example: 'Become a tech entrepreneur', description: 'User future aspirations' })
  @IsOptional()
  @IsString()
  futureAspirations?: string;
}
export class CreateUserDto {}
