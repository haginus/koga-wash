import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class AvailableSlotsQueryDto {
  @Type(() => Date)
  @IsDate()
  since?: Date;
}