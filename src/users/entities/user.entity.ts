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

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  role: Role;

  @OneToMany(type => ActivationToken, token => token.user)
  tokens: ActivationToken[];

  @OneToMany(type => Reservation, reservation => reservation.user)
  reservations: Reservation[];
}