import { IsEnum, IsNotEmpty } from "class-validator";
import { DryerMachine } from "../enitities/dryer-machine.entity";
import { WashingMachine } from "../enitities/washing-machine.entity";

export class MachineRequestDto {

  @IsNotEmpty()
  @IsEnum([WashingMachine.name, DryerMachine.name])
  kind: string;

  @IsNotEmpty()
  make: string;

  @IsNotEmpty()
  model: string;

}