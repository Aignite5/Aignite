import { PartialType } from '@nestjs/swagger';
import { CreateImpressionDto } from './impression.dto';

export class UpdateImpressionDto extends PartialType(CreateImpressionDto) {}
