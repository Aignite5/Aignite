import { forwardRef, Module } from '@nestjs/common';
import { AzureOpenaiService } from './azure-openai.service';
import { AzureOpenaiController } from './azure-openai.controller';
import { UsersModule } from 'src/users/users.module';
import { Users, UsersSchema } from 'src/users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    forwardRef(() => UsersModule),
        MongooseModule.forFeature([
          { name: Users.name, schema: UsersSchema },
        ]),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AzureOpenaiController],
  providers: [AzureOpenaiService],
  exports: [AzureOpenaiService],
})
export class AzureOpenaiModule {}
