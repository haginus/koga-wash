import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ActivationToken } from './entities/activation-token.entity';
import { PaginatedQuery } from 'src/lib/types/PaginatedQuery';
import { Paginated } from 'src/lib/types/Paginated';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = await this.usersRepository.save({ ...user, ...updateUserDto });
    return updatedUser;
  }

  async updateUserPassword(id: string, password: string) {
    const user = await this.findOne(id);
    user.password = password;
    return this.usersRepository.save(user);
  }

  async findAll(opts?: PaginatedQuery): Promise<Paginated<User>> {
    const [data, count] = await this.usersRepository.findAndCount({ take: opts?.limit, skip: opts?.offset });
    return { data, count };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('Utilizatorul nu există.');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'password', 'role']
    });

  }

  async delete(id: string) {
    const deletedUser = await this.usersRepository.delete({ id });
    return deletedUser;
  }

  async findToken(token: string) {
    return this.activationTokenRepositoty.findOneBy({ token });
  }
}
