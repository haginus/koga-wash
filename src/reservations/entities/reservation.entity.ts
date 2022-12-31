import { Type } from 'class-transformer';
import { Role } from 'src/auth/role.enum';
import { MachineInstance } from 'src/machines/enitities/machine-instance.entity';
import { Programme } from 'src/machines/enitities/programme.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

class ReservationMeta {
  @Type(() => Date)
  checkedInAt?: Date;

  @Type(() => Date)
  checkedOutAt?: Date;

  @Type(() => Date)
  cancelledAt?: Date;

  cancelledBy?: Role;

}

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
  @Type(() => ReservationMeta)
  meta: ReservationMeta;

  get isPending(): boolean {
    return this.status === ReservationStatus.PENDING || this.status === ReservationStatus.CHECKED_IN;
  }

  get isPast(): boolean {
    return [ReservationStatus.FINISHED, ReservationStatus.CANCELLED, ReservationStatus.NOT_HONORED].includes(this.status);
  }

  containsTime(time: Date): boolean {
    return time >= this.startTime && time <= this.endTime;
  }
  
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
  NOT_HONORED = "NOT_HONORED",
}


