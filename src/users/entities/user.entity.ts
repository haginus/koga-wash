import { Role } from "src/auth/role.enum";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ActivationToken } from "./activation-token.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  room: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  email: string;

  @Column({ select: false, default: "" })
  password: string;

  @Column()
  role: Role;

  @Column({ nullable: true })
  suspendedUntil?: Date;

  @OneToMany(type => ActivationToken, token => token.user)
  tokens: ActivationToken[];

  @OneToMany(type => Reservation, reservation => reservation.user)
  reservations: Reservation[];
}