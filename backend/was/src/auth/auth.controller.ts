import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERR_MSG } from 'src/common/constants/errors';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';

@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/kakao')
  async kakaoLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    /**
     * TODO : 에러 메시지를 전송해도 괜찮은가?
     */
    if (req.params.error) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_AUTH_CODE_FAILED);
    }
    const accessToken: AccessTokenDto = await this.authService.loginKakao(
      req.params.code,
    );
    res.cookie('mcat', accessToken.token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: accessToken.expiresIn,
    });
    res.sendStatus(200);
  }

  /**
   * TODO : 가드 수정 후 추가
   */
  @Get('logout/kakao')
  async kakaoLogout(@Req() req: Request): Promise<void> {
    await this.authService.logoutKakao(req.cookies.mct ?? '');
  }
}
