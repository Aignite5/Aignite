// progress.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: [] })
  year1: string[];

  @Prop({ default: [] })
  year2: string[];

  @Prop({ default: [] })
  year3: string[];

  @Prop({ default: [] })
  year4: string[];

  @Prop({ default: [] })
  year5: string[];

  @Prop({ default: [] })
  tasks: string[];

  @Prop({ default: [] })
  projects: string[];
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
