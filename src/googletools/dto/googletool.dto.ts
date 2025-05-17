// src/google-calendar/dto/create-google-meet.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsISO8601,
} from 'class-validator';

export class CreateGoogleMeetDto {
  @ApiProperty({ example: 'Team Sync', description: 'Event title/summary' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ example: 'Weekly check-in meeting', description: 'Event description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '2025-05-14T10:00:00',
    description: 'Start datetime in ISO format (UTC or with time zone)',
  })
  @IsISO8601()
  startDateTime: string;

  @ApiProperty({
    example: '2025-05-14T11:00:00',
    description: 'End datetime in ISO format (UTC or with time zone)',
  })
  @IsISO8601()
  endDateTime: string;

  @ApiProperty({
    example: ['john@example.com', 'jane@example.com'],
    description: 'List of attendee Gmail addresses',
    isArray: true,
  })
  @IsArray()
  @IsEmail({}, { each: true })
  attendees: string[];

  @ApiProperty({
    example: 'primary',
    description: 'Google Calendar ID (optional, defaults to "primary")',
    required: false,
  })
  @IsString()
  @IsOptional()
  calendarId?: string;
}



export class CreateGoogletoolDto {}
