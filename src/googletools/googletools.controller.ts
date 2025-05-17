import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoogletoolsService } from './googletools.service';
import { CreateGoogleMeetDto, CreateGoogletoolDto } from './dto/googletool.dto';
import { UpdateGoogletoolDto } from './dto/update-googletool.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Google Tools')
@Controller('googletools')
export class GoogletoolsController {
  constructor(private readonly googletoolsService: GoogletoolsService) {}
  // @Post('create-meeting')
  // @ApiOperation({ summary: 'Create Google Meet event with attendees' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Meeting created successfully',
  //   schema: {
  //     example: {
  //       link: 'https://calendar.google.com/event?eid=abc123',
  //       meetLink: 'https://meet.google.com/xyz-defg-hij',
  //       eventId: 'abc123',
  //     },
  //   },
  // })
  // @ApiResponse({ status: 500, description: 'Google API error or server issue' })
  // async createGoogleMeetEvent(
  //   @Body() dto: CreateGoogleMeetDto,
  // ): Promise<any> {
  //   return this.googletoolsService.createEventWithGoogleMeet(dto);
  // }
}
