import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateReservationDto {

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  machineInstanceId: string;

  @IsString()
  @IsNotEmpty()
  programmeId: string;

  // @IsDateString()
  @Type(() => Date)
  startTime: Date;
  
}