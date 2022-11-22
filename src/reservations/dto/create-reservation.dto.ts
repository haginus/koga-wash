import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateReservationDto {

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  machineInstance: string;

  @IsString()
  @IsNotEmpty()
  programme: string;

  // @IsDateString()
  @Type(() => Date)
  startTime: Date;
  
}