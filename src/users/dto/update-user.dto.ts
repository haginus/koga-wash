import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/role.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  room: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}