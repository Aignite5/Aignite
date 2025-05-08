// sessions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './schemas/sessions.schema';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    try {
      const session = new this.sessionModel(createSessionDto);
      return await session.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Session[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.sessionModel.find().skip(skip).limit(limit).exec(),
        this.sessionModel.countDocuments(),
      ]);
      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findByMentor(
    mentorId: Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Session[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.sessionModel
          .find({ mentorId })
          .populate('mentorId', 'firstName lastName email') // populate mentor
          .populate('userId', 'firstName lastName email')   // populate user
          .skip(skip)
          .limit(limit)
          .exec(),
        this.sessionModel.countDocuments({ mentorId }),
      ]);
      return { data, total };
    } catch (error) {
      throw error;
    }
  }
  async findByUser(
    userId: Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Session[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.sessionModel
          .find({ userId })
          .populate('mentorId', 'firstName lastName email') // populate mentor
          .populate('userId', 'firstName lastName email')   // populate user
          .skip(skip)
          .limit(limit)
          .exec(),
        this.sessionModel.countDocuments({ userId }),
      ]);
      return { data, total };
    } catch (error) {
      throw error;
    }
  }
    

  async update(id: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    try {
      const session = await this.sessionModel.findByIdAndUpdate(id, updateSessionDto, { new: true });
      if (!session) {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
      return session;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.sessionModel.findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
    } catch (error) {
      throw error;
    }
  }
}
