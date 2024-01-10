import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ERR_MSG } from 'src/common/constants/errors';
import { AuthService } from './auth.service';

@Controller('oauth')
export class AuthController {
  private readonly isProd: boolean;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.isProd = this.configService.get('ENV') === 'PROD';
  }

  @Get('login/kakao')
  async kakaoLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (req.params.error) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_AUTH_CODE_FAILED);
    }
    const jwt: string = await this.authService.loginKakao(req.params.code);
    res.cookie('magicconch', jwt, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'strict',
    });
    res.sendStatus(200);
  }

  /**
   * TODO : 가드 수정 후 적용 필요
   */
  @Get('logout')
  async kakaoLogout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authService.logout(req.cookies.magicconch);
    res.clearCookie('magicconch', {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'strict',
    });
  }
}
