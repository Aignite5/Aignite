import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole } from '../../utils/utils.constant';
import * as mongoose from 'mongoose';
@Schema({ timestamps: true })
export class Users {
  @ApiProperty()
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop()
  profilePic: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  date_of_birth:Date;
  
  @Prop()
  address:string;

  @Prop()
  phoneNumber: string;

  @ApiProperty()
  @Prop({ default: AppRole.USER })
  role: AppRole;

  @Prop()
  Country: string;

  @Prop({default:false})
  status: Boolean;

  @Prop()
  uniqueVerificationCode: string;

  @Prop({ default: new Date() })
  Last_sign_in: Date;

  @Prop({ default: 0 })
  Sign_in_counts: number;

}
export type UsersDocument = Users & Document;
export const UsersSchema = SchemaFactory.createForClass(Users);