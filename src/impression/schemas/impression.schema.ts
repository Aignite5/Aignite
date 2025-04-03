import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Impressions {
  @ApiProperty()
  @Prop({ required: true })
  userId: string; // The user who is being viewed

  @ApiProperty()
  @Prop({ required: true })
  viewerId: string; // The user who viewed the profile/ad/feature

  @ApiProperty()
  @Prop({ required: true, enum: ['profile', 'ad', 'feature','blueprint'] })
  type: string; // Type of impression (profile view, ad view, etc.)

  @ApiProperty()
  @Prop({ required: true })
  referenceId: string; // ID of the viewed item (e.g., profile ID, ad ID)

  @ApiProperty()
  @Prop({ default: new Date() })
  viewedAt: Date; // Timestamp of the impression
}

export type ImpressionsDocument = Impressions & Document;
export const ImpressionsSchema = SchemaFactory.createForClass(Impressions);
