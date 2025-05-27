import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
