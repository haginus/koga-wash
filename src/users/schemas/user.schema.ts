import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/role.enum';
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
  tokens: UserPasswordToken[];

  @Prop()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });