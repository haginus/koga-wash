import { Type } from "class-transformer";
import { IsUUID, IsOptional, IsDate } from "class-validator";
import { PaginatedQuery } from "src/lib/types/PaginatedQuery";

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

}