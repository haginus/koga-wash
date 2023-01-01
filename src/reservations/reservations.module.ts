import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesModule } from 'src/machines/machines.module';
import { MailModule } from 'src/mail/mail.module';
import { PlugsModule } from 'src/plugs/plugs.module';
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
    PlugsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, TasksService, Logger],
})
export class ReservationsModule {}