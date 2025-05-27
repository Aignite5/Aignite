import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateReviewDto,
  FlagReviewDto,
  PaginationDto,
  mentorReplyDto,
} from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async createReview(dto: CreateReviewDto) {
    try {
      const review = await this.reviewModel.create(dto);
      return {
        message: 'Review created successfully',
        status: 201,
        success: true,
        data: review,
      };
    } catch (error) {
      return {
        message: 'Failed to create review',
        status: 500,
        success: false,
        data: null,
      };
    }
  }

  async mentorReply(reviewId: string, dto: mentorReplyDto) {
    try {
      const updated = await this.reviewModel.findByIdAndUpdate(
        reviewId,
        { mentorReply: dto.mentorReply },
        { new: true },
      );
      return {
        message: 'Reply added successfully',
        status: 200,
        success: true,
        data: updated,
      };
    } catch {
      return {
        message: 'Failed to reply',
        status: 500,
        success: false,
        data: null,
      };
    }
  }

  async flagReview(reviewId: string, dto: FlagReviewDto) {
    try {
      const flagged = await this.reviewModel.findByIdAndUpdate(
        reviewId,
        { flaggedReview: dto.flaggedReview },
        { new: true },
      );
      return {
        message: 'Review flagged',
        status: 200,
        success: true,
        data: flagged,
      };
    } catch {
      return {
        message: 'Failed to flag review',
        status: 500,
        success: false,
        data: null,
      };
    }
  }

  async getReviewStatsBymentor(mentorId: string) {
    try {
      const sevenDaysAgo = moment().subtract(7, 'days').toDate();
  
      const [recentCount, totalCount, avgRating] = await Promise.all([
        this.reviewModel.countDocuments({
          mentorId,
          createdAt: { $gte: sevenDaysAgo },
        }),
        this.reviewModel.countDocuments({ mentorId }),
        this.reviewModel.aggregate([
          { $match: { mentorId: new Types.ObjectId(mentorId) } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$ratingStar' },
            },
          },
        ]),
      ]);
  
      return {
        success: true,
        status: 200,
        message: 'Review statistics fetched successfully',
        data: {
          recentReviewsCount: recentCount,
          totalReviewsCount: totalCount,
          averageRating: avgRating.length > 0 ? avgRating[0].averageRating : 0,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch review statistics');
    }
  }

  async getReviewsBytalent(
    talentId: string,
    { page = 1, limit = 10 }: PaginationDto,
  ) {
    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find({ talentId })
        .populate('talentId', 'email firstName lastName')
        .populate('mentorId', 'email firstName lastName')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.reviewModel.countDocuments({ talentId }),
    ]);
  
    return {
      message: 'talent reviews fetched',
      status: 200,
      success: true,
      data: { total, page, limit, reviews },
    };
  }
  async getReviewsBymentor(
    mentorId: string,
    { page = 1, limit = 10 }: PaginationDto,
  ) {
    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find({ mentorId })
        .populate('talentId', 'email firstName lastName')
        .populate('mentorId', 'email firstName lastName')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.reviewModel.countDocuments({ mentorId }),
    ]);
  
    return {
      message: 'mentor reviews fetched',
      status: 200,
      success: true,
      data: { total, page, limit, reviews },
    };
  }
}
