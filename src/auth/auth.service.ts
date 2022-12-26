import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { hashSync, compareSync } from "bcrypt";

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
    const user = await this.usersService.findOneByEmail(email);
    if (user && compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
