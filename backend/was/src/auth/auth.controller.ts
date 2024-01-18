import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ERR_MSG } from 'src/common/constants/errors';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { KakaoLoginDecorator, LogoutDecorator } from './auth.decorators';
import { JwtPayloadDto } from './dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { KakaoAuthService } from './service/kakao.auth.service';

@ApiTags('✅ Auth API')
@Controller('oauth')
export class AuthController {
  private readonly cookieOptions: object;
  constructor(
    private readonly configService: ConfigService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {
    this.cookieOptions = {
      httpOnly: true,
      secure: this.configService.get('ENV') === 'PROD',
      sameSite: 'lax',
    };
  }

  @Get('login/kakao')
  @KakaoLoginDecorator()
  async kakaoLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (req.cookies.magicconch) {
      throw new BadRequestException();
    }
    if (req.query.error) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_AUTH_CODE_FAILED);
    }
    const jwt: string = await this.kakaoAuthService.loginOAuth(
      req.query.code as string,
    );
    /**
     * TODO : socket.io에서 헤더 접근 확인 후에 수정 필요
     * - socket.io의 handshake에서 접근할 수 있는 값이 정해져 있음
     * - cookie는 접근을 못하는 듯 하여 authorization 헤더에 jwt 붙여주도록 구현
     */
    res.setHeader('Authorization', `Bearer ${jwt}`);
    res.cookie('magicconch', jwt, this.cookieOptions);
    res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @LogoutDecorator()
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
    res.removeHeader('Authorization');
    res.clearCookie('magicconch');
    res.sendStatus(200);
  }
}
