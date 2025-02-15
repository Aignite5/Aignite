import { PartialType } from '@nestjs/swagger';
import { CreateAzureOpenaiDto } from './create-azure-openai.dto';

export class UpdateAzureOpenaiDto extends PartialType(CreateAzureOpenaiDto) {}
