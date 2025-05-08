// update-session.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateSessionDto {
  @ApiPropertyOptional({ example: '2025-05-11', description: 'Updated session date' })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiPropertyOptional({ example: '15:00', description: 'Updated session time' })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ example: 'Updated reason', description: 'Updated reason for session' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'confirmed', description: 'Session status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'https://meeting.link', description: 'Meeting link' })
  @IsOptional()
  @IsString()
  meetingLink?: string;
}
