import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole, DefaultPassportLink } from '../../utils/utils.constant';
import * as mongoose from 'mongoose';
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
  Country: string;

  @Prop({ default: false })
  status: Boolean;

  @Prop()
  uniqueVerificationCode: string;

  @Prop({ default: new Date() })
  Last_sign_in: Date;

  @Prop({ default: 0 })
  Sign_in_counts: number;

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
  @Prop()
  highestEducation: string; // Example: "Bachelor's Degree", "Master's", etc.

  @Prop({ type: [String] })
  fieldsOfStudy: string[]; // Dropdown options like "Engineering", "Medicine", etc.

  @Prop()
  universityOrInstitution: string;

  // Career Interests
  @Prop({ type: [String] })
  industriesOfInterest: string[]; // Dropdown options like "Technology", "Finance", etc.

  @Prop()
  currentJobTitle: string;

  @Prop()
  careerExperience: string; // Text input for career-related details

  // Hobbies and Skills
  @Prop({ type: [String] })
  hobbies: string[];

  @Prop({ type: [String] })
  skills: string[];

  // Future Aspirations
  @Prop()
  futureAspirations: string;
}
export type UsersDocument = Users & Document;
export const UsersSchema = SchemaFactory.createForClass(Users);
