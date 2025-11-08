import { PartialType } from '@nestjs/swagger';
import { CreateAdminanalyticDto } from './adminanalytic.dto';

export class UpdateAdminanalyticDto extends PartialType(CreateAdminanalyticDto) {}
