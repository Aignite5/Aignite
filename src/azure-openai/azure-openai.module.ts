import { forwardRef, Module } from '@nestjs/common';
import { AzureOpenaiService } from './azure-openai.service';
import { AzureOpenaiController } from './azure-openai.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AzureOpenaiController],
  providers: [AzureOpenaiService],
  exports: [AzureOpenaiService],
})
export class AzureOpenaiModule {}
