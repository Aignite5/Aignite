import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AzureOpenaiService } from './azure-openai.service';
import { CareerSuggestionDto, CreateAzureOpenaiDto, GenerateCareerBlueprintDto, SelectCareerDto } from './dto/azure-openai.dto';
import { UpdateAzureOpenaiDto } from './dto/update-azure-openai.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Azure OpenAI')
@Controller('azure-openai')
export class AzureOpenaiController {
  constructor(private readonly azureOpenaiService: AzureOpenaiService) { }


  @Get(':id/career-blueprint')
  @ApiOperation({ summary: 'Generate Career Blueprint' })
  @ApiResponse({
    status: 200,
    description: 'Career blueprint generated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async generateCareerBlueprint(@Param('id') userId: string) {
    return await this.azureOpenaiService.generateCareerBlueprint(userId);
  }



  @Get(':userId/generate-suggestions/list')
  @ApiOperation({
    summary: 'Step 1: Generate personalized career path suggestions',
    description: 'Analyzes the user profile and returns 8 tailored career suggestions.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of career suggestions',
    type: [CareerSuggestionDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async generateSuggestions(@Param('userId') userId: string) {
    return this.azureOpenaiService.generateCareerPathSuggestions(userId);
  }



  @Post('generate-blueprint/full')
  @ApiOperation({
    summary: 'Step 2: Generate full 5-year career blueprint',
    description:
      'User selects one career → AI builds a deeply personalized, inspiring 5-year roadmap + structured JSON.',
  })
  @ApiResponse({
    status: 200,
    description: 'Full career blueprint (narrative + JSON)',
    schema: {
      example: {
        success: true,
        selectedCareer: 'Senior Product Designer',
        narrative: '### 5-Year Career Vision\nYou will evolve into...',
        json: {
          selectedCareerTitle: 'Senior Product Designer',
          careerVision: 'In five years, you will be a recognized design leader...',
          skillsSnapshot: { technical: { skills: ['Figma', 'Design Systems'], matchRating: 'Strong' }, soft: { skills: ['Empathy', 'Storytelling'], matchRating: 'Strong' } },
          skillGaps: ['Motion Design', 'Accessibility Leadership'],
          suggestedCareerPathways: [
            {
              title: 'Lead Product Designer',
              description: 'Own end-to-end design for a major product line...',
              requirements: '7+ years exp, portfolio with complex systems...',
              estimatedSalary: '$180k–$260k USD',
            },
          ],
          fiveYearRoadmap: {
            year1: ['Master advanced Figma', 'Lead one major redesign', '...'],
            year2: ['...'],
            year3: ['...'],
            year4: ['...'],
            year5: ['Become Head of Design or start your own studio'],
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'AI failed to respond' })
  async generateBlueprint(@Body() dto: SelectCareerDto) {
    return this.azureOpenaiService.generateCareerBlueprintForSelectedCareer(
      dto.userId,
      dto.careerTitle,
    );
  }

}
