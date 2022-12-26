import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: string;
}