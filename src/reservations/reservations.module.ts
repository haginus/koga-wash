import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesModule } from 'src/machines/machines.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { Reservation } from './entities/reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    MachinesModule,
    UsersModule,
    MailModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, TasksService, Logger],
})
export class ReservationsModule {}