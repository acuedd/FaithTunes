import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email, sub: user.id, role: user.role,
    };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '900s',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        id: user.id,
      },
    };
  }

  async register(data: RegisterDto) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await this.usersService.create({ ...data, password: hash, role: 'user' });
    return this.login(newUser);
  }

  verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}