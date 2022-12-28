import { Reservation } from "src/reservations/entities/reservation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Machine } from "./machine.entity";

@Entity()
export class MachineInstance {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Machine, (machine) => machine.instances)
  machine: Machine;

  @OneToMany(() => Reservation, (reservation) => reservation.machineInstance)
  reservations: Reservation[];
}
