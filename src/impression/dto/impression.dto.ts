import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class LogImpressionDto {
  @ApiProperty({ example: '65f2c4a8b4d2e613e8a4f1b9', description: 'The ID of the user being viewed' })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '65f2d4b8c3e1a413e8a4f2c0', description: 'The ID of the user viewing the profile, ad, or feature' })
  @IsMongoId()
  @IsNotEmpty()
  viewerId: string;

  @ApiProperty({ example: 'profile', enum: ['profile', 'ad', 'feature'], description: 'The type of impression' })
  @IsEnum(['profile', 'ad', 'feature',"blueprint"])
  @IsNotEmpty()
  type: 'profile' | 'ad' | 'feature' | 'blueprint';

  @ApiProperty({ example: '65f2c4a8b4d2e613e8a4f1b9', description: 'The ID of the entity being viewed (Profile ID, Ad ID, or Feature ID)' })
  @IsMongoId()
  @IsNotEmpty()
  referenceId: string;
}



export class CreateImpressionDto {}
