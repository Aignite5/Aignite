// create-session.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSessionDto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'User ID' })
  @IsNotEmpty()
  userId: Types.ObjectId;

  @ApiProperty({ example: '60d0fe4f5311236168a109cb', description: 'Mentor ID' })
  @IsNotEmpty()
  mentorId: Types.ObjectId;

  @ApiProperty({ example: '2025-05-10', description: 'Session date' })
  @IsDateString()
  date: Date;

  @ApiProperty({ example: '14:00', description: 'Session time' })
  @IsString()
  time: string;

  @ApiProperty({ example: 'Discuss project roadmap', description: 'Reason for session' })
  @IsString()
  reason: string;
}

