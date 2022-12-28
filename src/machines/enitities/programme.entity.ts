import { Reservation } from "src/reservations/entities/reservation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Machine } from "./machine.entity";

@Entity()
export class Programme {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  wheelIndex: number;

  @Column({ nullable: true })
  description: string;

  /** Duration of the programme in minutes. */
  @Column()
  duration: number;

  @Column()
  materialKind: MaterialKind;

  @ManyToOne(() => Machine, (machine) => machine.programmes)
  machine: Machine;

  @OneToMany(() => Reservation, (reservation) => reservation.programme)
  reservations: Reservation[];
}

export enum MaterialKind {
  COTTON = "COTTON",
  WOOL = "WOOL",
  SILK = "SILK",
  POLYESTER = "POLYESTER",
  RAYON = "RAYON",
  LINEN = "LINEN",
  MIXED = "MIXED",
}
