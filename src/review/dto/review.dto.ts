import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '609e12714f1a2c001f7b8b56' })
  @IsNotEmpty()
  @IsString()
  talentId: string;

  @ApiProperty({ example: '609e12714f1a2c001f7b8b78' })
  @IsNotEmpty()
  @IsString()
  mentorId: string;

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @IsNumber()
  ratingStar: number;

  @ApiProperty({ example: 'Great transaction!' })
  @IsNotEmpty()
  @IsString()
  reviewText: string;
}

export class mentorReplyDto {
  @ApiProperty({ example: 'Thanks for your feedback!' })
  @IsNotEmpty()
  @IsString()
  mentorReply: string;
}

export class FlagReviewDto {
  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  flaggedReview: boolean;
}

export class PaginationDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  limit?: number;
}
