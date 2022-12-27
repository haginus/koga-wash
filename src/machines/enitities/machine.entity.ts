import { Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { MachineInstance } from "./machine-instance.entity";
import { Programme } from "./programme.entity";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Machine {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @OneToMany(type => MachineInstance, instance => instance.machine, { eager: true })
  instances: MachineInstance[];

  @OneToMany(type => Programme, instance => instance.machine, { eager: true })
  programmes: Programme[];

}