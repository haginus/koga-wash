import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserPasswordToken, UserPasswordTokenSchema } from './user-password-token.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  _id: string;
  
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [UserPasswordTokenSchema] })
  programmes: UserPasswordToken[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });