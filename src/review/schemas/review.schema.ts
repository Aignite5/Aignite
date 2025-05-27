import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  talentId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  mentorId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  ratingStar: number;

  @Prop({ type: String, required: true })
  reviewText: string;

  @Prop({ type: Boolean, default: false })
  flaggedReview: boolean;

  @Prop({ type: String, default: '' })
  mentorReply: string;

  @Prop({ type: Date, default: Date.now }) // Optional if timestamps already handles it
  reviewDate: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
