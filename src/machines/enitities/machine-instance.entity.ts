import { Reservation } from "src/reservations/entities/reservation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Machine } from "./machine.entity";

@Entity()
export class MachineInstance {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isFaulty: boolean;

  @Column()
  plugId: string;

  @ManyToOne(() => Machine, (machine) => machine.instances, { eager: true })
  machine: Machine;

  @OneToMany(() => Reservation, (reservation) => reservation.machineInstance)
  reservations: Reservation[];
}
