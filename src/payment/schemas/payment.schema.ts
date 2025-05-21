// payment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Users } from 'src/users/schema/user.schema';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
    required: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
    required: true,
  })
  mentorId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, enum: ['LITE', 'STANDARD'] })
  selectedPlan: 'LITE' | 'STANDARD';

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending', enum: ['pending', 'success', 'failed'] })
  status: 'pending' | 'success' | 'failed';

  @Prop()
  paymentLink: string;

  @Prop()
  reference: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
