import { Module } from '@nestjs/common';
import { ImpressionService } from './impression.service';
import { ImpressionController } from './impression.controller';
import { Impressions, ImpressionsSchema } from './schemas/impression.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
      // forwardRef(() => AzureOpenaiModule),
      MongooseModule.forFeature([
        { name: Impressions.name, schema: ImpressionsSchema },
      ]),
    ],
  controllers: [ImpressionController],
  providers: [ImpressionService],
})
export class ImpressionModule {}
