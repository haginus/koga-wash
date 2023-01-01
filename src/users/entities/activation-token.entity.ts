import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ActivationToken {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.tokens, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column()
  createdAt: Date;

  @Column()
  used: boolean;

}
