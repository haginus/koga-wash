import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { MaterialKind } from "../enitities/programme.entity";

export class ProgrammeRequestDto {
  @IsNotEmpty()
  @MaxLength(256)
  @IsString()
  name: string;

  @IsNotEmpty()
  @Min(0)
  wheelIndex: number;

  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;

  @IsNotEmpty()
  materialKind: MaterialKind;

  @IsNotEmpty()
  @IsUUID()
  machineId: string;
}