
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


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

export class SelectCareerDto {
  @ApiProperty({ description: 'Exact career title' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Exact career title' })
  @IsString()
  @IsNotEmpty()
  careerTitle: string;

  // Optional: pass the whole selected object if you want richer context
  @ApiProperty({ description: 'Exact career title' })
  selectedCareer?: {
    title: string;
    shortDescription?: string;
    whyItFits?: string;
    growthPotential?: string;
    estimatedSalary5Years?: string;
  };
}


export class CareerSuggestionDto {
  @ApiProperty({ description: 'Exact career title' })
  title: string;

  @ApiProperty({ description: 'One-sentence summary' })
  shortDescription: string;

  @ApiProperty({ description: 'Why this fits the user' })
  whyItFits: string;

  @ApiProperty({ description: 'Growth outlook' })
  growthPotential: string;

  @ApiProperty({ description: 'Estimated salary in 5 years' })
  estimatedSalary5Years: string;
}


class SkillsSnapshotDto {
  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ enum: ['Strong', 'Moderate', 'Needs Development'] })
  matchRating: string;
}

class PathwayDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  requirements: string;

  @ApiProperty()
  estimatedSalary: string;
}

export class CareerBlueprintJsonDto {
  @ApiProperty()
  selectedCareerTitle: string;

  @ApiProperty()
  careerVision: string;

  @ApiProperty({ type: () => SkillsSnapshotDto })
  technical: SkillsSnapshotDto;

  @ApiProperty({ type: () => SkillsSnapshotDto })
  soft: SkillsSnapshotDto;

  @ApiProperty({ type: [String] })
  skillGaps: string[];

  @ApiProperty({ type: [PathwayDto] })
  suggestedCareerPathways: PathwayDto[];

  @ApiProperty({ type: () => Object })
  fiveYearRoadmap: Record<'year1' | 'year2' | 'year3' | 'year4' | 'year5', string[]>;
}

export class CreateAzureOpenaiDto { }
