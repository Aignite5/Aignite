import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AzureOpenaiService } from './azure-openai.service';
import { CreateAzureOpenaiDto, GenerateCareerBlueprintDto } from './dto/azure-openai.dto';
import { UpdateAzureOpenaiDto } from './dto/update-azure-openai.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Azure OpenAI')
@Controller('azure-openai')
export class AzureOpenaiController {
  constructor(private readonly azureOpenaiService: AzureOpenaiService) {}


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



  @Post(':id/career-blueprint/selected-career')
  @ApiOperation({
    summary: 'Generate a personalized 5-year career blueprint',
    description:
      `Generates an inspiring, personalized, 5-year AI-powered career plan based on the user's selected career and full profile.`,
  })
  @ApiBody({
    type: GenerateCareerBlueprintDto,
    description: 'Payload containing the userId and the selected career',
  })
  @ApiResponse({
    status: 200,
    description: 'Career blueprint generated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'AI failed to generate a response',
  })
  async generateCareerBlueprintSeletedCareer(
    @Body() dto: GenerateCareerBlueprintDto,
  ) {
    return this.azureOpenaiService.generateCareerBlueprintForSelectedCareer(
      dto.userId,
      dto.careerData,
    );
  }

}
