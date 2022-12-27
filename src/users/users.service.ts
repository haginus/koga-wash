import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ActivationToken } from './entities/activation-token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(ActivationToken) private activationTokenRepositoty: Repository<ActivationToken>,
    private mailService: MailService
  ) {}

  private generatePasswordToken(user: User) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return { user, token, createdAt: new Date(), used: false };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    try {
      const createdUser = await this.usersRepository.save(createUserDto);
      const createdUserPasswordToken = await this.activationTokenRepositoty.save(this.generatePasswordToken(createdUser));
      await this.mailService.sendUserConfirmation(createdUser, createdUserPasswordToken.token);
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(id: string, password: string) {
    const user = await this.findOne(id);
    user.password = password;
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async delete(id: string) {
    const deletedUser = await this.usersRepository.delete({ id });
    return deletedUser;
  }

  async findToken(token: string) {
    return this.activationTokenRepositoty.findOneBy({ token });
  }
}
