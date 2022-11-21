import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

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
  materialKind: string;
}