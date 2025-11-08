import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AzureOpenaiModule } from './azure-openai/azure-openai.module';
import { ImpressionModule } from './impression/impression.module';
import { SessionsModule } from './sessions/sessions.module';
import { GoogletoolsModule } from './googletools/googletools.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { AdminanalyticsModule } from './adminanalytics/adminanalytics.module';



@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 60, limit: 40 }),

    MongooseModule.forRoot(String(process.env.MONGODB_URL).trim()),
    AuthModule,
    UsersModule,
    AzureOpenaiModule,
    ImpressionModule,
    SessionsModule,
    PaymentModule,
    ReviewModule,
    AdminanalyticsModule,
    // GoogletoolsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
