import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class MachineInstanceRequestDto {

  @IsNotEmpty()
  @IsString()
  machineId: string;

  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsBoolean()
  isFaulty: boolean;
  
}