import { Type } from "class-transformer";
import { ArrayNotEmpty, IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { DryerMachine } from "../enitities/dryer-machine.entity";
import { WashingMachine } from "../enitities/washing-machine.entity";
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