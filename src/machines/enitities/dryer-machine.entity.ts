import { ChildEntity } from "typeorm";
import { Machine } from "./machine.entity";

@ChildEntity()
export class DryerMachine extends Machine {

}