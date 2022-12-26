import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { hashSync, compareSync } from "bcrypt";
import { User } from 'src/users/schemas/user.schema';
import { JwtPayloadDto } from './dto/JwtPayloadDto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  public async changePassword({ token, password }: ChangePasswordDto) {
    if(password.length < 8) {
      throw new BadRequestException('Parola trebuie să conțină minimum 8 caractere.');
    }
    const tokenResult = await this.usersService.findToken(token);
    if(!tokenResult || tokenResult.used) {
      throw new BadRequestException('Token invalid.');
    }
    await this.usersService.updateUserPassword(tokenResult.user._id, hashSync(password, 10));
    await tokenResult.updateOne({ used: true });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = (await this.usersService.findOneByEmail(email)).toJSON();
    if (user && compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayloadDto = { email: user.email, role: user.role, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUserByJwt(payload: JwtPayloadDto) {
    const user = await this.usersService.findOne(payload.sub);
    if (user) {
      return user.toJSON();
    }
    return null;
  }
}
