import { Role } from "../role.enum";

export interface JwtPayloadDto {
  email: string;
  role: Role;
  sub: string;
}