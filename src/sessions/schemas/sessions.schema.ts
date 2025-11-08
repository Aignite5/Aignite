import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId; // mentee

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  mentorId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop()
  reason: string;

  @Prop({ required: true })
  topic: string; // e.g. "Career Development", "Resume Review"

  @Prop({ required: true })
  duration: string; // e.g. "60 min"

  @Prop({ required: true })
  amount: number; // e.g. 120 (store as number for easier calculations)

  @Prop({ enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop()
  meetingLink: string;

  @Prop({ default: false })
  paid: boolean; // Whether the session has been paid for

  @Prop()
  notes: string; // Optional notes from mentor or mentee

  @Prop()
  recordingLink: string; // Optional recording URL for completed sessions

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number; // Rating given by mentee

  @Prop()
  feedback: string; // Optional feedback text

  @Prop({ default: false })
  mentorConfirmed: boolean;

  @Prop({ default: false })
  menteeConfirmed: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
