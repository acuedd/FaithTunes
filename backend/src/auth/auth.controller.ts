import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return this.authService.login(user);
  }

  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Usuario autenticado',
    schema: {
      example: {
        userId: 1,
        email: 'test@example.com'
      }
    }
  })
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @Post('refresh')
  async refreshToken(@Body('refresh_token') refresh: string) {
    try {
      const decoded = this.authService.verifyRefreshToken(refresh);
      return this.authService.login({ email: decoded.email, id: decoded.sub });
    } catch (e) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}