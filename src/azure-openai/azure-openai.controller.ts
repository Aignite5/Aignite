import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AzureOpenaiService } from './azure-openai.service';
import { CreateAzureOpenaiDto } from './dto/create-azure-openai.dto';
import { UpdateAzureOpenaiDto } from './dto/update-azure-openai.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Azure OpenAI')
@Controller('azure-openai')
export class AzureOpenaiController {
  constructor(private readonly azureOpenaiService: AzureOpenaiService) {}

  @Post('completion')
  @ApiOperation({ summary: 'Get a completion from Azure OpenAI' })
  @ApiResponse({ status: 200, description: 'Completion generated successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', example: 'When was Microsoft founded?' },
      },
    },
  })
  async getCompletion(@Body('prompt') prompt: string): Promise<string> {
    return this.azureOpenaiService.getCompletion(prompt);
  }

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

  @Get('inhouse/:id/career-blueprint')
  @ApiOperation({ summary: 'Generate Career Blueprint' })
  @ApiResponse({
    status: 200,
    description: 'Career blueprint generated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async generateCareerBlueprintInHouse(@Param('id') userId: string) {
    return await this.azureOpenaiService.generateCareerBlueprintInHouse(userId);
  }
}
