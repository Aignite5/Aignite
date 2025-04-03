import { Injectable } from '@nestjs/common';
import { CreateImpressionDto, LogImpressionDto } from './dto/impression.dto';
import { UpdateImpressionDto } from './dto/update-impression.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Impressions } from './schemas/impression.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class ImpressionService {
  constructor(
    @InjectModel(Impressions.name) private impressionsModel: Model<Impressions>,
  ) {}

  /**
   * 📌 Log an impression when a user views a profile, ad, or feature.
   */
  async logImpression(payload: LogImpressionDto) {
    const { userId, viewerId, type, referenceId } = payload;
    if (userId === viewerId) {
      return {
        success: false,
        message: 'Users cannot view their own profiles',
      };
    }

    const impression = new this.impressionsModel({
      userId,
      viewerId,
      type,
      referenceId,
      viewedAt: new Date(),
    });

    await impression.save();
    return { success: true, message: 'Impression logged successfully' };
  }

  /**
   * 📌 Get the total number of impressions for a user (profile views, ad views, etc.).
   */
  async getUserImpressions(userId: string) {
    const totalImpressions = await this.impressionsModel
      .countDocuments({ userId })
      .exec();
    return { success: true, userId, totalImpressions };
  }

  async getDailyImpressions(userId: string) {
    const today = moment().startOf('day');
    const lastMonth = moment().subtract(30, 'days').startOf('day');

    // 1️⃣ Fetch impressions for the last 30 days and group by day
    const impressions = await this.impressionsModel.aggregate([
      {
        $match: {
          userId,
          viewedAt: { $gte: lastMonth.toDate(), $lte: today.toDate() },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2️⃣ Create a date range for the last 30 days
    const dailyCounts = {};
    for (let i = 0; i < 30; i++) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      dailyCounts[date] = 0;
    }

    // 3️⃣ Fill in the counts from MongoDB data
    impressions.forEach((entry) => {
      dailyCounts[entry._id] = entry.count;
    });

    // 4️⃣ Return data as an array of { date, count }
    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .reverse();
  }

  async getGeneralDailyImpressions() {
    const today = moment().startOf('day');
    const lastMonth = moment().subtract(30, 'days').startOf('day');

    // 1️⃣ Fetch impressions for the last 30 days and group by day
    const impressions = await this.impressionsModel.aggregate([
      {
        $match: {
          viewedAt: { $gte: lastMonth.toDate(), $lte: today.toDate() },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2️⃣ Create a date range for the last 30 days
    const dailyCounts = {};
    for (let i = 0; i < 30; i++) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      dailyCounts[date] = 0;
    }
    console.log(impressions);
    // 3️⃣ Fill in the counts from MongoDB data
    impressions.forEach((entry) => {
      dailyCounts[entry._id] = entry.count;
    });

    // 4️⃣ Return data as an array of { date, count }
    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .reverse();
  }
}
