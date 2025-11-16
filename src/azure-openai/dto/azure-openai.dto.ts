
import { ApiProperty } from '@nestjs/swagger';

export class GenerateCareerBlueprintDto {
  @ApiProperty({
    description: 'The ID of the user for whom the career blueprint will be generated.',
    example: '66fa4a2dbf73501e12d42cd3',
  })
  userId: string;

  @ApiProperty({
    description:
      'The selected career that the user wants to pursue. The AI will generate a blueprint aligned with this career.',
    example: 'AI Product Manager',
  })
  careerData: string;
}


export class CreateAzureOpenaiDto {}
