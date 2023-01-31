import { Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { MachineInstance } from "./machine-instance.entity";
import { Programme } from "./programme.entity";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "kind" } })
export abstract class Machine {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  kind: 'WashingMachine' | 'DryerMachine';

  @OneToMany(type => MachineInstance, instance => instance.machine)
  instances: MachineInstance[];

  @OneToMany(type => Programme, instance => instance.machine)
  programmes: Programme[];

}