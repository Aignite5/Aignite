import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  CreateReviewDto,
  FlagReviewDto,
  PaginationDto,
  mentorReplyDto,
} from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiBody({ type: CreateReviewDto })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(dto);
  }

  @Get('stats/mentor/:mentorId')
  @ApiOperation({ summary: 'Get review statistics by mentor ID' })
  @ApiParam({ name: 'mentorId', required: true, description: 'mentor ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns recent count, total count, and average rating',
    schema: {
      example: {
        success: true,
        status: 200,
        message: 'Review statistics fetched successfully',
        data: {
          recentReviewsCount: 3,
          totalReviewsCount: 24,
          averageRating: 4.2,
        },
      },
    },
  })
  getReviewStatsBymentor(@Param('mentorId') mentorId: string) {
    return this.reviewService.getReviewStatsBymentor(mentorId);
  }

  @Patch('reply/:id')
  @ApiOperation({ summary: 'mentor adds a reply to a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiBody({ type: mentorReplyDto })
  reply(@Param('id') id: string, @Body() dto: mentorReplyDto) {
    return this.reviewService.mentorReply(id, dto);
  }

  @Patch('flag/:id')
  @ApiOperation({ summary: 'Flag a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiBody({ type: FlagReviewDto })
  flag(@Param('id') id: string, @Body() dto: FlagReviewDto) {
    return this.reviewService.flagReview(id, dto);
  }

  @Get('talent/:talentId')
  @ApiOperation({ summary: 'Fetch reviews by talent ID' })
  @ApiParam({ name: 'talentId', description: 'talent ID' })
  getBytalent(@Param('talentId') talentId: string, @Query() query: PaginationDto) {
    return this.reviewService.getReviewsBytalent(talentId, query);
  }

  @Get('mentor/:mentorId')
  @ApiOperation({ summary: 'Fetch reviews by mentor ID' })
  @ApiParam({ name: 'mentorId', description: 'mentor ID' })
  getBymentor(
    @Param('mentorId') mentorId: string,
    @Query() query: PaginationDto,
  ) {
    return this.reviewService.getReviewsBymentor(mentorId, query);
  }
}
