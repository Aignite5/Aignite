import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminanalyticsService } from './adminanalytics.service';
import { UsersService } from 'src/users/users.service';

@ApiTags('Admin Analytics')
@Controller('admin-analytics')
export class AdminanalyticsController {
  constructor(
    private readonly adminAnalyticsService: AdminanalyticsService,
  ) { }

  /**
   * 🧮 Get Admin Analytics Overview
   */
  @Get('overview')
  @ApiOperation({
    summary: 'Get Admin Analytics Overview',
    description:
      'Returns key statistics, user persona distribution, and engagement metrics for the admin dashboard.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched analytics data',
    schema: {
      example: {
        stats: {
          totalUsers: 29,
          activeUsers: 20,
          totalMentors: 9,
          pendingApplications: 20,
          totalSessions: 892,
          totalRevenue: 45680,
          monthlyGrowth: 12.5,
        },
        usersByPersona: [
          { name: 'Talents', count: 20, percentage: 65, color: 'bg-blue-500' },
          { name: 'Mentors', count: 15, percentage: 5, color: 'bg-purple-500' },
          { name: 'Partners', count: 20, percentage: 30, color: 'bg-green-500' },
        ],
        engagementData: [
          {
            metric: 'Daily Active Users',
            value: '1,234',
            change: '+8.2%',
            trend: 'up',
          },
          {
            metric: 'Session Duration',
            value: '24 min',
            change: '+3.5%',
            trend: 'up',
          },
          {
            metric: 'Session Completion',
            value: '87%',
            change: '-2.1%',
            trend: 'down',
          },
          {
            metric: 'User Retention',
            value: '73%',
            change: '+5.4%',
            trend: 'up',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while fetching analytics data',
  })
  async getAnalytics() {
    return this.adminAnalyticsService.getAdminAnalytics();
  }

  /**
   * 👥 Get All Users (with pagination, filter & search)
   */
  @Get('users')
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Fetch all users with pagination, optional filtering by user type, and search query.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results per page (default: 10)',
  })
  @ApiQuery({
    name: 'userType',
    required: false,
    type: String,
    description: 'Filter by user type (e.g., USER, MENTOR, PARTNER)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by first name, last name, or email',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved users list',
    schema: {
      example: {
        total: 56,
        currentPage: 1,
        totalPages: 6,
        pageSize: 10,
        users: [
          {
            _id: '64b6c9f2b7d89a12f4e3f8b1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'MENTOR',
            status: true,
            createdAt: '2025-10-01T09:30:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('userType') userType?: string,
    @Query('search') search?: string,
  ) {
    return this.adminAnalyticsService.getAllUsers(
      Number(page),
      Number(limit),
      userType,
      search,
    );
  }


   @Get("sessions")
  @ApiOperation({
    summary: 'Get all sessions',
    description:
      'Fetch all mentoring sessions with pagination, optional filtering by status, mentor, or user, and optional search query.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results per page (default: 10)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description:
      "Filter sessions by status (e.g., 'pending', 'confirmed', 'completed', 'cancelled')",
  })
  @ApiQuery({
    name: 'mentorId',
    required: false,
    type: String,
    description: 'Filter by mentor ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search sessions by reason or meeting link',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved sessions list',
    schema: {
      example: {
        total: 6,
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        sessions: [
          {
            _id: '64b6c9f2b7d89a12f4e3f8b1',
            userId: '64b6c9f2b7d89a12f4e3f8a1',
            mentorId: '64b6c9f2b7d89a12f4e3f8a2',
            date: '2025-11-03T00:00:00.000Z',
            time: '14:00',
            reason: 'Career Development',
            status: 'completed',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            createdAt: '2025-10-31T10:20:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllSessions(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('mentorId') mentorId?: string,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
  ) {
    return this.adminAnalyticsService.getAllSessions(
      Number(page),
      Number(limit),
      status,
      mentorId,
      userId,
      search,
    );
  }


  //   @Get('seed/session')
  // @ApiOperation({ summary: 'Seed session data for testing' })
  // async seedSessions() {
  //   return this.adminAnalyticsService.seedSessions();
  // }
}
