import { Type } from "class-transformer";
import { ArrayNotEmpty, IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { DryerMachine } from "../schemas/dryer-machine.schema";
import { WashingMachine } from "../schemas/washing-machine.schema";
import { ProgrammeRequestDto } from "./programme-request.dto";

export class CreateMachineDto {

  @IsNotEmpty()
  @IsEnum([WashingMachine.name, DryerMachine.name])
  kind: string;

  @IsNotEmpty()
  make: string;

  @IsNotEmpty()
  model: string;

  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ProgrammeRequestDto)
  programmes: ProgrammeRequestDto[];

}