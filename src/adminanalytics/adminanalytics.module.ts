import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminanalyticsService } from './adminanalytics.service';
import { AdminanalyticsController } from './adminanalytics.controller';
import { Users, UsersSchema } from 'src/users/schema/user.schema';
import { Session, SessionSchema } from 'src/sessions/schemas/sessions.schema';
import { Payment, PaymentSchema } from 'src/payment/schemas/payment.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [AdminanalyticsController],
  providers: [AdminanalyticsService],
})
export class AdminanalyticsModule {}
