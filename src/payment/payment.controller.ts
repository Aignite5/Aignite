// payment.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Initialize payment and generate Paystack link' })
  @ApiResponse({
    status: 201,
    description: 'Payment link created successfully',
  })
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Fetch payments by userId' })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, description: 'Payments fetched successfully' })
  async getByUserId(@Param('userId') userId: string) {
    return this.paymentService.getPaymentsByUserId(userId);
  }

  @Get('mentor/:mentorId')
  @ApiOperation({ summary: 'Fetch payments by mentorId' })
  @ApiParam({ name: 'mentorId', type: String })
  @ApiResponse({ status: 200, description: 'Payments fetched successfully' })
  async getByMentorId(@Param('mentorId') mentorId: string) {
    return this.paymentService.getPaymentsByMentorId(mentorId);
  }
}
