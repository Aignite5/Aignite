import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Payment, PaymentDocument } from 'src/payment/schemas/payment.schema';
import { Session, SessionDocument } from 'src/sessions/schemas/sessions.schema';
import { Users, UsersDocument } from 'src/users/schema/user.schema';


@Injectable()
export class AdminanalyticsService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) { }

  async getAdminAnalytics() {
    const [
      totalUsers,
      activeUsers,
      totalMentors,
      pendingApplications,
      totalSessions,
      totalRevenue,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ status: true }),
      this.userModel.countDocuments({ role: 'MENTOR' }),
      this.userModel.countDocuments({ mentorVerificationStatus: false }),
      this.sessionModel.countDocuments(),
      this.paymentModel.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    // Fallback if no revenue found
    const revenueValue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Mocked monthly growth — can be computed later via time-based aggregation
    const monthlyGrowth = 12.5;

    // Persona segmentation
    const talentsCount = await this.userModel.countDocuments({ role: 'USER' });
    const mentorsCount = await this.userModel.countDocuments({ role: 'MENTOR' });
    const partnersCount = await this.userModel.countDocuments({ role: 'PARTNER' });

    const totalPersona = talentsCount + mentorsCount + partnersCount || 1;
    const usersByPersona = [
      {
        name: 'Talents',
        count: talentsCount,
        percentage: Math.round((talentsCount / totalPersona) * 100),
        color: 'bg-blue-500',
      },
      {
        name: 'Mentors',
        count: mentorsCount,
        percentage: Math.round((mentorsCount / totalPersona) * 100),
        color: 'bg-purple-500',
      },
      {
        name: 'Partners',
        count: partnersCount,
        percentage: Math.round((partnersCount / totalPersona) * 100),
        color: 'bg-green-500',
      },
    ];

    // Engagement metrics (mocked; you can make this dynamic later)
    const engagementData = [
      { metric: 'Daily Active Users', value: '10', change: '+8.2%', trend: 'up' },
      { metric: 'Session Duration', value: '24 min', change: '+3.5%', trend: 'up' },
      { metric: 'Session Completion', value: '87%', change: '-2.1%', trend: 'down' },
      { metric: 'User Retention', value: '73%', change: '+5.4%', trend: 'up' },
    ];

    return {
      stats: {
        totalUsers,
        activeUsers,
        totalMentors,
        pendingApplications,
        totalSessions,
        totalRevenue: revenueValue,
        monthlyGrowth,
      },
      usersByPersona,
      engagementData,
    };
  }


  async getAllUsers(
    page = 1,
    limit = 10,
    userType?: string,
    search?: string,
  ) {
    const filter: any = {};

    // Filter by userType (role)
    if (userType) {
      filter.role = userType.toUpperCase();
    }

    // Optional search by name or email
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      users,
    };
  }


  async getAllSessions(
    page: number,
    limit: number,
    status?: string,
    mentorId?: string,
    userId?: string,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const filter: FilterQuery<SessionDocument> = {};

    // Apply filters dynamically
    if (status) filter.status = status;
    if (mentorId) filter.mentorId = mentorId;
    if (userId) filter.userId = userId;
    if (search) {
      filter.$or = [
        { reason: { $regex: search, $options: 'i' } },
        { meetingLink: { $regex: search, $options: 'i' } },
      ];
    }

    const [sessions, total] = await Promise.all([
      this.sessionModel
        .find(filter)
        .populate('userId', 'firstName lastName email')
        .populate('mentorId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.sessionModel.countDocuments(filter),
    ]);

    return {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
      sessions,
    };
  }

// async seedSessions() {
//   const existing = await this.sessionModel.countDocuments();
//   if (existing > 0) {
//     return { message: 'Sessions already exist, skipping seeding...' };
//   }

//   // Fetch real mentors and users
//   const mentors = await this.userModel.find({ role: 'MENTOR' }).lean();
//   const users = await this.userModel.find({ role: 'USER' }).lean();

//   if (!mentors.length || !users.length) {
//     return { message: 'No mentors or users found to create sessions.' };
//   }

//   const data = [
//     {
//       userId: users[0]._id,
//       mentorId: mentors[0]._id,
//       date: new Date('2025-11-03'),
//       time: '10:00 AM',
//       reason: 'Career Development',
//       topic: 'Career Development',
//       duration: '60 min',
//       amount: 120,
//       status: 'completed',
//       meetingLink: 'https://meet.google.com/abc-dev',
//     },
//     {
//       userId: users[1]?._id || users[0]._id, // fallback if users[1] is undefined
//       mentorId: mentors[1]?._id || mentors[0]._id,
//       date: new Date('2025-11-04'),
//       time: '2:00 PM',
//       reason: 'Resume Review',
//       topic: 'Resume Review',
//       duration: '45 min',
//       amount: 90,
//       status: 'confirmed',
//       meetingLink: 'https://meet.google.com/abc-resume',
//     },
//     {
//       userId: users[2]?._id || users[0]._id,
//       mentorId: mentors[2]?._id || mentors[0]._id,
//       date: new Date('2025-11-05'),
//       time: '11:30 AM',
//       reason: 'Portfolio Review',
//       topic: 'Portfolio Review',
//       duration: '60 min',
//       amount: 120,
//       status: 'pending',
//       meetingLink: 'https://meet.google.com/abc-portfolio',
//     },
//   ];

//   await this.sessionModel.insertMany(data);
//   return { message: '✅ Sample sessions seeded successfully!', totalInserted: data.length };
// }

}
