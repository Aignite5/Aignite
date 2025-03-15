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
    MongooseModule.forRoot("mongodb+srv://aiignite:BpVsYnBDrH2WS5R@ai-ignite.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"),   
    // MongooseModule.forRoot(String(process.env.MONGODB_URL).trim()),
    AuthModule,
    UsersModule,
    AzureOpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
