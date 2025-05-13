import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export enum YearsOfExperience {
  ONE_TO_THREE = '1-3 years',
  FOUR_TO_SEVEN = '4-7 years',
  EIGHT_TO_FIFTEEN = '8-15 years',
  OVER_FIFTEEN = '15+ years',
}

export enum IndustryExpertise {
  TECHNOLOGY = 'Technology',
  FINANCE = 'Finance',
  HEALTHCARE = 'Healthcare',
  EDUCATION = 'Education',
  CONSULTING = 'Consulting',
  MANUFACTURING = 'Manufacturing',
  OTHER = 'Other',
}

export enum SpecializationAreas {
  AI_ML = 'AI & ML',
  PRODUCT_MANAGEMENT = 'Product Management',
  SOFTWARE_ENGINEERING = 'Software Engineering',
  CYBERSECURITY = 'Cybersecurity',
  DATA_ANALYTICS = 'Data Analytics',
  LEADERSHIP = 'Leadership',
  MARKETING = 'Marketing',
  ENTREPRENEURSHIP = 'Entrepreneurship',
  OTHER = 'Other',
}

export enum FocusAreas {
  CAREER_GUIDANCE = 'Career Guidance',
  TECHNICAL_MENTORING = 'Technical Mentoring',
  INTERVIEW_PREP = 'Job Interview Prep',
  LEADERSHIP_COACHING = 'Leadership Coaching',
  INDUSTRY_INSIGHTS = 'Industry Insights',
  PROJECT_GUIDANCE = 'Project Guidance',
}

export enum PreferredMenteeTypes {
  STUDENTS = 'Students',
  CAREER_CHANGERS = 'Career Changers',
  EARLY_CAREER = 'Early-Career Professionals',
  STARTUP_FOUNDERS = 'Startup Founders',
}

export enum MentorshipFormat {
  ONE_ON_ONE = '1-on-1 Sessions',
  GROUP = 'Group Sessions',
  ASYNC = 'Async via Messaging',
  WEBINARS = 'Webinars/Workshops',
}

export enum Availability {
  ONE_HOUR_WEEK = '1 hour/week',
  TWO_THREE_HOURS_MONTH = '2-3 hours/month',
  FLEXIBLE = 'On-demand / Flexible',
}

export class UpdateMentorshipAndProfessionalInfoDto {
  @ApiPropertyOptional({
    example: 'Data Scientist',
    description: 'Current professional title or role',
  })
  @IsOptional()
  @IsString()
  ProfessionalTitle: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/johndoe',
    description: 'LinkedIn profile URL',
  })
  @IsOptional()
  @IsUrl()
  linkedInProfileUrl?: string;

  @ApiPropertyOptional({
    example: 'Google',
    description: 'Current employer or organization',
  })
  @IsOptional()
  @IsString()
  currentEmployer?: string;

  @ApiPropertyOptional({
    enum: YearsOfExperience,
    description: 'Years of professional experience',
  })
  @IsOptional()
  @IsEnum(YearsOfExperience)
  yearsOfExperience?: YearsOfExperience;

  @ApiPropertyOptional({
    enum: IndustryExpertise,
    isArray: true,
    description: 'Industry expertise areas',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryExpertise, { each: true })
  @ArrayUnique()
  industryExpertise?: IndustryExpertise[];

  @ApiPropertyOptional({
    enum: SpecializationAreas,
    isArray: true,
    description: 'Specialization areas',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SpecializationAreas, { each: true })
  @ArrayUnique()
  specializationAreas?: SpecializationAreas[];

  @ApiPropertyOptional({
    enum: FocusAreas,
    isArray: true,
    description: 'Preferred mentorship focus areas',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(FocusAreas, { each: true })
  @ArrayUnique()
  focusAreas?: FocusAreas[];

  @ApiPropertyOptional({
    enum: PreferredMenteeTypes,
    isArray: true,
    description: 'Preferred types of mentees',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PreferredMenteeTypes, { each: true })
  @ArrayUnique()
  preferredMenteeTypes?: PreferredMenteeTypes[];

  @ApiPropertyOptional({
    enum: MentorshipFormat,
    isArray: true,
    description: 'Preferred mentorship format',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MentorshipFormat, { each: true })
  @ArrayUnique()
  mentorshipFormat?: MentorshipFormat[];

  @ApiPropertyOptional({
    enum: Availability,
    description: 'Availability for mentorship',
  })
  @IsOptional()
  @IsEnum(Availability)
  availability?: Availability;
}
