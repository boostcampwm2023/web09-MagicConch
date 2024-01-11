import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CONTENT_TYPE, METHODS, OAUTH_URL } from 'src/common/constants/apis';
import { ERR_MSG } from 'src/common/constants/errors';
import { PROVIDER_ID, PROVIDER_NAME } from 'src/common/constants/etc';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { KakaoAccessTokenInfoDto } from '../dto/kakao/kakao-access-token-info.dto';
import { KakaoTokenDto } from '../dto/kakao/kakao-token.dto';
import { RefreshKakaoTokenDto } from '../dto/kakao/refresh-kakao-token.dto';
import { RequestKakaoTokenDto } from '../dto/kakao/request-kakao-token.dto';
import { OAuthTokenDto } from '../dto/oauth-token.dto';
import { ProfileDto } from '../dto/profile.dto';
import { CacheKey } from '../interface/cache-key';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoAuthService extends AuthService {
  constructor(
    @InjectRepository(Member)
    readonly membersService: MembersService,
    readonly jwtService: JwtService,
    readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    readonly cacheManager: Cache,
  ) {
    super(membersService, jwtService, configService, cacheManager);
    this.init(PROVIDER_NAME.KAKAO);
  }

  async loginOAuth(code: string): Promise<string> {
    const token: KakaoTokenDto = await this.requestToken(code);
    const profile: ProfileDto = await this.getOIDCuserInfo(
      token.id_token ?? '',
    );
    const member: Member | null = await this.membersService.findByEmail(
      profile.email,
      PROVIDER_ID.KAKAO,
    );
    if (member) {
      return this.login(
        member.id,
        PROVIDER_ID.KAKAO,
        profile,
        OAuthTokenDto.fromKakao(token),
      );
    }
    return this.signup(
      PROVIDER_ID.KAKAO,
      profile,
      OAuthTokenDto.fromKakao(token),
    );
  }

  async logoutOAuth(user: JwtPayloadDto): Promise<boolean> {
    const tokenInfo: KakaoAccessTokenInfoDto | null =
      await this.getAccessTokenInfo(user.accessToken);
    if (tokenInfo) {
      return this.requestLogout(user.accessToken);
    }
    const key: CacheKey = { email: user.email, providerId: user.providerId };
    const keyString: string = JSON.stringify(key);
    const refreshToken: string | undefined =
      await this.cacheManager.get<string>(keyString);
    const newToken: KakaoTokenDto = await this.refreshToken(refreshToken ?? '');
    return this.requestLogout(newToken.access_token);
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
   */
  private async requestToken(code: string): Promise<KakaoTokenDto> {
    const reqBody: RequestKakaoTokenDto = RequestKakaoTokenDto.fromInfo(
      this.clientId,
      this.redirectUri,
      code,
      this.clientSecret,
    );
    try {
      const res: any = await fetch(OAUTH_URL.KAKAO_TOKEN, {
        method: METHODS.POST,
        headers: { 'Content-type': CONTENT_TYPE.KAKAO },
        body: JSON.stringify(reqBody),
      });
      return (await res.json()) as KakaoTokenDto;
    } catch (err: unknown) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_TOKEN_FAILED);
    }
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#refresh-token
   */
  private async refreshToken(refreshToken: string): Promise<KakaoTokenDto> {
    const reqBody: RefreshKakaoTokenDto = RefreshKakaoTokenDto.fromInfo(
      this.clientId,
      refreshToken,
      this.clientSecret,
    );
    try {
      const res: any = await fetch(OAUTH_URL.KAKAO_TOKEN, {
        method: METHODS.POST,
        headers: { 'Content-type': CONTENT_TYPE.KAKAO },
        body: JSON.stringify(reqBody),
      });
      return (await res.json()) as KakaoTokenDto;
    } catch (err: unknown) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_TOKEN_FAILED);
    }
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#oidc-user-info
   */
  private async getOIDCuserInfo(idToken: string): Promise<ProfileDto> {
    const res: any = await fetch(OAUTH_URL.KAKAO_OIDC_USERINFO, {
      headers: { 'Content-type': CONTENT_TYPE.KAKAO },
      body: JSON.stringify({ id_token: idToken }),
    });
    const resBody: any = await res.json();
    return ProfileDto.fromKakao(resBody);
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info
   */
  private async getAccessTokenInfo(
    accessToken: string,
  ): Promise<KakaoAccessTokenInfoDto | null> {
    const res: any = await fetch(OAUTH_URL.KAKAO_ACCESS_TOKEN, {
      headers: { Authorization: `Authorization: Bearer ${accessToken}` },
    });
    const detail: any = { status: res.code, body: await res.json() };
    if (detail.status === 200) {
      return detail.body as KakaoAccessTokenInfoDto;
    }
    return this.handleAccessTokenInfoError(detail.status, detail.body.code);
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#logout
   */
  private async requestLogout(accessToken: string): Promise<boolean> {
    await fetch(OAUTH_URL.KAKAO_LOGOUT, {
      method: METHODS.POST,
      headers: {
        Authorization: `Authorization: Bearer ${accessToken}`,
        'Content-type': CONTENT_TYPE.KAKAO,
      },
    });
    return true;
  }

  private handleAccessTokenInfoError(status: number, code: number): null {
    if (status === 401) {
      return null;
    }
    throw new InternalServerErrorException(
      code === -1
        ? ERR_MSG.OAUTH_KAKAO_ACCESS_TOKEN_INFO_KAKAO_ERROR
        : ERR_MSG.OAUTH_KAKAO_ACCESS_TOKEN_INFO_BAD_REQUEST,
    );
  }
}
