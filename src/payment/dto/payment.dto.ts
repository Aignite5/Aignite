// dto/create-payment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'user123' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'mentor123' })
  @IsString()
  mentorId: string;

  @ApiProperty({ enum: ['LITE', 'STANDARD'], example: 'LITE' })
  @IsEnum(['LITE', 'STANDARD'])
  selectedPlan: 'LITE' | 'STANDARD';
}
