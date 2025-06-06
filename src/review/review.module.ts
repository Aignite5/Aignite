import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Review.name, schema: ReviewSchema },
      ]),
  
      forwardRef(() => UsersModule),
    ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
