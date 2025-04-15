import { PartialType } from '@nestjs/swagger';
import { CreateAzureOpenaiDto } from './azure-openai.dto';

export class UpdateAzureOpenaiDto extends PartialType(CreateAzureOpenaiDto) {}
