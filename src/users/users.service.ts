import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPasswordToken, UserPasswordTokenDocument } from './schemas/user-password-token.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserPasswordToken.name) private userPasswordTokenModel: Model<UserPasswordTokenDocument>,
    private mailService: MailService) {}

  private generatePasswordToken(user: User) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return new this.userPasswordTokenModel({ user, token });
  }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    try {
      const createdUser = await (new this.userModel(createUserDto)).save();
      const createdUserPasswordToken = await this.generatePasswordToken(createdUser).save();
      await this.mailService.sendUserConfirmation(createdUser.toJSON(), createdUserPasswordToken.toJSON().token);
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedUser;
  }
}
