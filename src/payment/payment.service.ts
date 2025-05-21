// payment.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Users } from 'src/users/schema/user.schema';
import { CreatePaymentDto } from './dto/payment.dto';
import { generateUniqueKey } from 'src/utils/utils.function';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Users.name) private userModel: Model<Users>,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const mentor = await this.userModel.findById(dto.mentorId);
    if (!mentor) throw new NotFoundException('Mentor not found');

    const user = await this.userModel.findById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    const amount = dto.selectedPlan === 'LITE'
      ? mentor.LitePlanPrice
      : mentor.StandardPlanPrice;

    const reference = await generateUniqueKey(15);

    try {
      const res = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: user.email,
          amount: amount * 100, // convert to kobo
          reference,
          callback_url: 'https://yourapp.com/payment/callback',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const payment = new this.paymentModel({
        userId: dto.userId,
        mentorId: dto.mentorId,
        selectedPlan: dto.selectedPlan,
        amount,
        paymentLink: res.data.data.authorization_url,
        reference,
        status: 'pending',
      });

      await payment.save();

      return {
        success: true,
        message: 'Payment initialized',
        paymentLink: res.data.data.authorization_url,
      };

    } catch (error) {
      console.error('Paystack error:', error?.response?.data || error.message);
      throw new InternalServerErrorException('Failed to initialize payment');
    }
  }

async getPaymentsByUserId(userId: string) {
  const payments = await this.paymentModel
    .find({ userId })
    .populate('userId', 'firstName lastName')
    .populate('mentorId', 'firstName lastName')
    .exec();

  return {
    success: true,
    message: 'Payments fetched by userId',
    data: payments,
  };
}

async getPaymentsByMentorId(mentorId: string) {
  const payments = await this.paymentModel
    .find({ mentorId })
    .populate('userId', 'firstName lastName')
    .populate('mentorId', 'firstName lastName')
    .exec();

  return {
    success: true,
    message: 'Payments fetched by mentorId',
    data: payments,
  };
}

}
