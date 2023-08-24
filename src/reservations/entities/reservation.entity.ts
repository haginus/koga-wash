import { plainToInstance, Type } from 'class-transformer';
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

  initialEnergyUsage?: number;

  @Type(() => ReservationMetaFlag)
  flags?: ReservationMetaFlag[] = [];

  hasFlag(flagReason: FlagReason) {
    return !!this.flags?.find((flag) => flag.flagReason === flagReason);
  }

}

class ReservationMetaFlag {
  @Type(() => Date)
  flaggedAt: Date;

  flaggedByUserId: string;

  flagReason: FlagReason;
}

type FlagReason = 'clothes_left_behind';

@Entity()
export class Reservation {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => MachineInstance, (machineInstance) => machineInstance.reservations, { eager: true })
  machineInstance: MachineInstance;

  @ManyToOne(() => User, (user) => user.reservations, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Programme, (programme) => programme.reservations, { eager: true })
  programme: Programme;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  status: ReservationStatus;

  /** Energy usage in watts */
  @Column()
  energyUsage: number;

  @Column({ default: false })
  flagged: boolean;

  @Column({
    type: 'simple-json',
    transformer: {
      from: (value) => plainToInstance(ReservationMeta, value),
      to: (value) => value,
    }
  })
  meta: ReservationMeta;

  get isPending(): boolean {
    return this.status === ReservationStatus.PENDING || this.status === ReservationStatus.CHECKED_IN;
  }

  get isPast(): boolean {
    return [ReservationStatus.FINISHED, ReservationStatus.CANCELLED, ReservationStatus.NOT_HONORED].includes(this.status);
  }

  get canCheckIn() {
    return this.status == ReservationStatus.PENDING && Math.abs(this.startTime.getTime() - Date.now()) <= 5 * 60 * 1000;
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


