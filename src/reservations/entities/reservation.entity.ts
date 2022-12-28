import * as mongoose from 'mongoose';
import { MachineInstance } from 'src/machines/enitities/machine-instance.entity';
import { Programme } from 'src/machines/enitities/programme.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export type ReservationDocument = mongoose.HydratedDocument<Reservation>;

@Entity()
export class Reservation {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => MachineInstance, (machineInstance) => machineInstance.reservations, { eager: true })
  machineInstance: MachineInstance;

  @ManyToOne(() => User, (user) => user.reservations, { eager: true })
  user: User;

  @ManyToOne(() => Programme, (programme) => programme.reservations, { eager: true })
  programme: Programme;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  status: ReservationStatus;

  @Column("simple-json")
  meta: ReservationMeta;
  
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
  NOT_HONORED = "NOT_HONORED",
}

interface ReservationMeta {
  checkInTime?: Date;
}
