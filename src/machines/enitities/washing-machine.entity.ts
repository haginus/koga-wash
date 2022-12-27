import { ChildEntity } from "typeorm";
import { Machine } from "./machine.entity";

@ChildEntity()
export class WashingMachine extends Machine {

}