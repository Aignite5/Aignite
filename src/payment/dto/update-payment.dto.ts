import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
