import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ActivationToken } from './entities/activation-token.entity';
import { PaginatedQuery } from 'src/lib/types/PaginatedQuery';
import { Paginated } from 'src/lib/types/Paginated';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { SuspendUserDto } from './dto/suspend-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(ActivationToken) private activationTokenRepositoty: Repository<ActivationToken>,
    private dataSource: DataSource,
    private mailService: MailService
  ) {}

  private generatePasswordToken(user: User) {
    const token = Array.from({ length: 6 }, () =>  Math.random().toString(36).substring(2, 15)).join('');
    return plainToInstance(ActivationToken, { user, token, createdAt: new Date(), used: false });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    try {
      return this.dataSource.transaction(async (manager) => {
        const createdUser = await manager.save(plainToInstance(User, createUserDto));
        const createdUserPasswordToken = await manager.save(this.generatePasswordToken(createdUser));
        await this.mailService.sendUserConfirmation(createdUser, createdUserPasswordToken.token);
        return createdUser;
      });
    } catch (error) {
      throw new BadRequestException('A apărut o eroare.');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = await this.usersRepository.save({ ...user, ...updateUserDto });
    return updatedUser;
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
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'password', 'role', 'suspendedUntil']
    });

  }

  async delete(id: string) {
    const deletedUser = await this.usersRepository.delete({ id });
    return deletedUser;
  }

  async suspend(id: string, suspendUserDto: SuspendUserDto) {
    const user = await this.findOne(id);
    if(suspendUserDto.until < new Date()) {
      throw new BadRequestException('Data trebuie să fie în viitor.');
    }
    user.suspendedUntil = suspendUserDto.until;
    return this.usersRepository.save(user);
  }

  async unsuspend(id: string) {
    const user = await this.findOne(id);
    user.suspendedUntil = null;
    return this.usersRepository.save(user);
  }

  async findToken(token: string) {
    return this.activationTokenRepositoty.findOneBy({ token });
  }
}
