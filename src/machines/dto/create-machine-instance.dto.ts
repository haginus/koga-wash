import { IsNotEmpty, IsString } from "class-validator";

export class CreateMachineInstanceDto {

  @IsNotEmpty()
  @IsString()
  machineId: string;

  @IsNotEmpty()
  @IsString()
  name: string;
  
}