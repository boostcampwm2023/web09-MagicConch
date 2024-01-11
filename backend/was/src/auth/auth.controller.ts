import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ERR_MSG } from 'src/common/constants/errors';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { AuthGuard } from './guard/auth.guard';
import { KakaoAuthService } from './service/kakao.auth.service';

@Controller('oauth')
export class AuthController {
  private readonly isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {
    this.isProd = this.configService.get('ENV') === 'PROD';
  }

  @Get('login/kakao')
  async kakaoLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (req.params.error) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_AUTH_CODE_FAILED);
    }
    const jwt: string = await this.kakaoAuthService.loginOAuth(req.params.code);
    res.cookie('magicconch', jwt, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'strict',
    });
    res.sendStatus(200);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async kakaoLogout(@Req() req: any, @Res() res: Response): Promise<void> {
    const user: JwtPayloadDto = req.user;
    switch (user.providerId) {
      case PROVIDER_ID.KAKAO:
        await this.kakaoAuthService.logoutOAuth(user);
        break;
      case PROVIDER_ID.NAVER:
        break;
      case PROVIDER_ID.GOOGLE:
        break;
    }
    res.clearCookie('magicconch', {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'strict',
    });
    res.sendStatus(200);
  }
}
