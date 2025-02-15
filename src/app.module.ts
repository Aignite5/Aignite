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



@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 60, limit: 40 }),
    MongooseModule.forRoot("mongodb+srv://monumentaleworks:tvJizAFi8MBLGBE4@cluster0.glmot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    MongooseModule.forRoot(String(process.env.MONGODB_URL).trim()),
    AuthModule,
    UsersModule,
    AzureOpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
