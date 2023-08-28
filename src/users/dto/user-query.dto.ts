import { IsOptional, IsString } from "class-validator";
import { PaginatedQuery } from "src/lib/types/PaginatedQuery";

export class UserQueryDto extends PaginatedQuery {

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;


  @IsOptional()
  @IsString()
  email?: string;
}