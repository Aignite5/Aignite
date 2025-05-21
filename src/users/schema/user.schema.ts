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
  specialty: string;

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

  @Prop()
  Carreer_Dream: string;

  @ApiProperty()
  @Prop()
  fieldOfStudy: string[]; // Single text input for major

  // Hobbies and Skills
  @Prop({ type: [String] })
  hobbies: string[];

  @Prop({ type: [String] })
  skills: string[];

  @Prop()
  careerExperience: string; // Text input for career-related details

  @Prop({ type: [String] })
  Career_goals: string[];

  @Prop({ type: [String] })
  Skill_developement_strategies: string[];

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

  // Work Experience
  @ApiProperty()
  @Prop()
  workExperience: string; // Yes/No field

  @ApiProperty()
  @Prop()
  ageRange: string; // Yes/No field

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

  //////////////////////////////////////FOR MENTORS//////////////////////////////////////
  //////////////////////////////////////FOR MENTORS//////////////////////////////////////
  //////////////////////////////////////FOR MENTORS//////////////////////////////////////
  //////////////////////////////////////FOR MENTORS//////////////////////////////////////
  //////////////////////////////////////FOR MENTORS//////////////////////////////////////
  //////////////////////////////////////FOR MENTORS//////////////////////////////////////
  //////////////////////////////////////FOR MENTORS//////////////////////////////////////
  @Prop({ required: false })
  ProfessionalTitle: string;

  @Prop({ default: 0 })
  LitePlanPrice: number;

  @Prop({ default: 0 })
  StandardPlanPrice: number;

  @Prop({ required: false })
  linkedInProfileUrl?: string;

  @Prop({ required: false })
  currentEmployer?: string;

  @Prop({
    required: false,
    // enum: ['1-3 years', '4-7 years', '8-15 years', '15+ years'],
  })
  yearsOfExperience?: string;

  @Prop({
    type: [String],
    // enum: [
    //   'Technology',
    //   'Finance',
    //   'Healthcare',
    //   'Education',
    //   'Consulting',
    //   'Manufacturing',
    //   'Other',
    // ],
    default: [],
  })
  industryExpertise?: string[];

  @Prop({
    type: [String],
    // enum: [
    //   'AI & ML',
    //   'Product Management',
    //   'Software Engineering',
    //   'Cybersecurity',
    //   'Data Analytics',
    //   'Leadership',
    //   'Marketing',
    //   'Entrepreneurship',
    //   'Other',
    // ],
    default: [],
  })
  specializationAreas?: string[];

  // 🎯 Mentorship Preferences
  @Prop({
    type: [String],
    // enum: [
    //   'Career Guidance',
    //   'Technical Mentoring',
    //   'Job Interview Prep',
    //   'Leadership Coaching',
    //   'Industry Insights',
    //   'Project Guidance',
    // ],
    default: [],
  })
  focusAreas?: string[];

  @Prop({
    type: [String],
    // enum: [
    //   'Students',
    //   'Career Changers',
    //   'Early-Career Professionals',
    //   'Startup Founders',
    // ],
    default: [],
  })
  preferredMenteeTypes?: string[];

  @Prop({
    type: [String],
    // enum: [
    //   '1-on-1 Sessions',
    //   'Group Sessions',
    //   'Async via Messaging',
    //   'Webinars/Workshops',
    // ],
    default: [],
  })
  mentorshipFormat?: string[];

  @Prop({
    required: false,
    // enum: ['1 hour/week', '2-3 hours/month', 'On-demand / Flexible'],
  })
  availability?: string;
}

export type UsersDocument = Users & Document;
export const UsersSchema = SchemaFactory.createForClass(Users);
