import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImpressionService } from './impression.service';
import { CreateImpressionDto, LogImpressionDto } from './dto/impression.dto';
import { UpdateImpressionDto } from './dto/update-impression.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


@ApiTags('Impressions')
@Controller('impression')
export class ImpressionController {
  constructor(private readonly impressionService: ImpressionService) {}

  @Post('log')
  @ApiOperation({ summary: 'Log an impression when a user views a profile, ad, or feature' })
  async logImpression(@Body() logImpressionDto: LogImpressionDto) {
    return this.impressionService.logImpression(logImpressionDto);
  }

  /**
   * 📌 Get the total number of impressions for a user.
   */
  @Get(':userId/total')
  @ApiOperation({ summary: 'Get total impressions for a user' })
  @ApiParam({ name: 'userId', required: true, example: '65f2c4a8b4d2e613e8a4f1b9' })
  async getUserImpressions(@Param('userId') userId: string) {
    return this.impressionService.getUserImpressions(userId);
  }

  @Get(':userId/daily')
  @ApiOperation({ summary: 'Get daily impressions for the past 30 days' })
  @ApiParam({ name: 'userId', required: true, example: '65f2c4a8b4d2e613e8a4f1b9' })
  async getDailyImpressions(@Param('userId') userId: string) {
    return this.impressionService.getDailyImpressions(userId);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get general daily impressions for the past 30 days' })
  async getGeneralDailyImpressions() {
    return this.impressionService.getGeneralDailyImpressions();
  }
}
