import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole, DefaultPassportLink } from '../../utils/utils.constant';

@Schema({ timestamps: true })
export class Users {
  @ApiProperty()
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop()
  profilePic: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  date_of_birth: Date;

  @Prop()
  address: string;

  @Prop()
  phoneNumber: string;

  @ApiProperty()
  @Prop({ default: AppRole.USER })
  role: AppRole;

  @Prop()
  country: string;

  @Prop({ default: new Date() })
  Last_sign_in: Date;

  @Prop({ default: 0 })
  Sign_in_counts: number;

  @Prop({ default: false })
  status: boolean;

  @Prop()
  uniqueVerificationCode: string;

  @Prop({ default: new Date() })
  last_sign_in: Date;

  @Prop({ default: 0 })
  sign_in_counts: number;

  @ApiProperty()
  @Prop({ default: DefaultPassportLink.male })
  profileImageUrl: string;

  @ApiProperty()
  @Prop({ default: true })
  allowPushNotifications: boolean;

  @ApiProperty()
  @Prop({ default: false })
  allowSmsNotifications: boolean;

  @ApiProperty()
  @Prop({ default: true })
  allowEmailNotifications: boolean;

  @ApiProperty()
  @Prop({ default: new Date() })
  createdDate: Date;

  
  // Academic Background
  @ApiProperty()
  // @Prop({ enum: ['O-Level', 'Diploma', 'Bachelor’s', 'Master’s and above'] })
  @Prop()
  highestLevelOfEducation: string; // Updated field name

  @ApiProperty()
  @Prop()
  fieldOfStudy: string[]; // Single text input for major

  // Hobbies and Skills
  @Prop({ type: [String] })
  hobbies: string[];

  @Prop({ type: [String] })
  skills: string[];

  @ApiProperty()
  @Prop()
  universityOrInstitution: string;

  // Career Interests
  @ApiProperty()
  // @Prop({
  //   enum: [
  //     'Student',
  //     'Recent Graduate',
  //     'Employed',
  //     'Self-Employed',
  //     'Career Transition',
  //   ],
  // })
  @Prop()
  currentStatus: string;

  @ApiProperty()
  @Prop({ type: [String] })
  industriesOfInterest: string[]; // Multi-select dropdown

  @Prop()
  currentJobTitle: string;

  @Prop()
  careerExperience: string; // Text input for career-related details

  // Work Experience
  @ApiProperty()
  @Prop()
  workExperience: string; // Yes/No field

  @ApiProperty()
  @Prop()
  excitingWork: string; // What type of work excites the user

  // Skills
  @ApiProperty()
  @Prop({ type: [String] })
  technicalSkills: string[]; // Multi-select dropdown

  @ApiProperty()
  @Prop({ type: [String] })
  softSkills: string[]; // Multi-select dropdown

  // Preferences
  @ApiProperty()
  @Prop({ type: [String] })
  preferredWorkEnvironments: string[]; // Multi-select dropdown

  @ApiProperty()
  @Prop({ type: [String] })
  learningPreferences: string[]; // Multi-select dropdown

  @ApiProperty()
  @Prop({ type: [String] })
  careerChallenges: string[]; // Multi-select dropdown

  // Future Aspirations
  @Prop()
  futureAspirations: string;

  @ApiProperty()
  @Prop()
  additionalInfo: string; // Optional text input for personalization

  @Prop({ type: String, default: null })  
  careerBlueprint: string; // Stores the generated blueprint as a string
}

export type UsersDocument = Users & Document;
export const UsersSchema = SchemaFactory.createForClass(Users);
