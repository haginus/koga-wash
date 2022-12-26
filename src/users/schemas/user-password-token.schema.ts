import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { User } from "./user.schema";

export type UserPasswordTokenDocument = mongoose.HydratedDocument<UserPasswordToken>;

@Schema()
export class UserPasswordToken {

  _id: string;

  @Prop()
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

}

export const UserPasswordTokenSchema = SchemaFactory.createForClass(UserPasswordToken);
