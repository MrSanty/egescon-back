import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { LoginUserEntity } from './entities/login-user.entity';
import { Tokens } from './types/types';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private _setCookies(res: Response, tokens: Tokens) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
  }

  @Public()
  @ResponseMessage('Inicio de sesión exitoso')
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserEntity> {
    const { tokens, ...data } = await this.authService.login(loginDto);
    this._setCookies(res, tokens);
    return new LoginUserEntity(data);
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ResponseMessage('Tokens actualizados exitosamente')
  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;
    const tokens = await this.authService.refreshToken(
      user.id,
      user.refreshToken,
    );
    this._setCookies(res, tokens);
    return true;
  }

  @ResponseMessage('Se ha cerrado la sesión exitosamente')
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;
    await this.authService.logout(user.sub);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return true;
  }
}
