import { Type } from "class-transformer";
import { IsUUID, IsOptional, IsDate, IsEnum } from "class-validator";
import { PaginatedQuery } from "src/lib/types/PaginatedQuery";
import { ReservationStatus } from "../entities/reservation.entity";

export class ReservationQueryDto extends PaginatedQuery {

  @IsOptional()
  @IsUUID()
  instanceId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  since?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  until?: Date;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

}