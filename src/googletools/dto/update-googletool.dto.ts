import { PartialType } from '@nestjs/swagger';
import { CreateGoogletoolDto } from './googletool.dto';

export class UpdateGoogletoolDto extends PartialType(CreateGoogletoolDto) {}
