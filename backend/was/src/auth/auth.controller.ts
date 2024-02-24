import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProviderIdEnum } from '@constants/etc';
import {
  AuthenticateDecorator,
  KakaoLoginDecorator,
  LogoutDecorator,
} from './auth.decorators';
import { AuthStatusDto, JwtPayloadDto } from './dto';
import { JwtAuthGuard } from './guard';
import { KakaoAuthService } from './service/kakao.auth.service';

dotenv.config();

@ApiTags('✅ Auth API')
@Controller('oauth')
export class AuthController {
  private readonly cookieOptions: object;

  constructor(private readonly kakaoAuthService: KakaoAuthService) {
    this.cookieOptions = {
      httpOnly: true,
      secure: process.env.ENV === 'PROD',
      sameSite: 'lax',
      maxAge: 3600000,
    };
  }

  @Get('authenticate')
  @AuthenticateDecorator(AuthStatusDto)
  authorize(@Req() req: Request): AuthStatusDto {
    const isAuthenticated: boolean = req.cookies.magicconch ? true : false;
    return { isAuthenticated };
  }

  @Get('login/kakao')
  @KakaoLoginDecorator()
  async kakaoLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (req.cookies.magicconch || !req.query.code) {
      throw new BadRequestException();
    }
    const jwt: string = await this.kakaoAuthService.loginOAuth(
      req.query.code as string,
    );
    res.cookie('magicconch', jwt, this.cookieOptions);
    res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @LogoutDecorator()
  async kakaoLogout(@Req() req: any, @Res() res: Response): Promise<void> {
    const user: JwtPayloadDto = req.user;
    switch (user.providerId) {
      case ProviderIdEnum.KAKAO:
        await this.kakaoAuthService.logoutOAuth(user);
        break;
      case ProviderIdEnum.NAVER:
        break;
      case ProviderIdEnum.GOOGLE:
        break;
    }
    res.clearCookie('magicconch');
    res.sendStatus(200);
  }
}
