import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/user.schema';
import { AzureOpenaiModule } from 'src/azure-openai/azure-openai.module';

@Module({
  imports: [
    forwardRef(() => AzureOpenaiModule),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
