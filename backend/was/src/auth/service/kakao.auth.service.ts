import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CONTENT_TYPE, METHODS, OAUTH_URL } from 'src/common/constants/apis';
import { ERR_MSG } from 'src/common/constants/errors';
import { PROVIDER_ID, PROVIDER_NAME } from 'src/common/constants/etc';
import { Member } from 'src/members/entities';
import { MembersService } from 'src/members/members.service';
import { JwtPayloadDto, OAuthTokenDto, ProfileDto } from '../dto';
import { KakaoAccessTokenInfoDto, KakaoTokenDto } from '../dto/kakao';
import { CacheKey } from '../interface/cache-key';
import { makeRefreshTokenForm, makeRequestTokenForm } from '../util/kakao';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoAuthService extends AuthService {
  constructor(
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
    const profile: ProfileDto = await this.getUser(token.access_token ?? '');
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
    const reqBody: URLSearchParams = makeRequestTokenForm(
      this.clientId,
      this.redirectUri,
      code,
      this.clientSecret,
    );
    try {
      const res: any = await fetch(OAUTH_URL.KAKAO_TOKEN, {
        method: METHODS.POST,
        headers: { 'Content-type': CONTENT_TYPE.KAKAO },
        body: reqBody,
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
    const reqBody: URLSearchParams = makeRefreshTokenForm(
      this.clientId,
      refreshToken,
      this.clientSecret,
    );
    try {
      const res: any = await fetch(OAUTH_URL.KAKAO_TOKEN, {
        method: METHODS.POST,
        headers: { 'Content-type': CONTENT_TYPE.KAKAO },
        body: reqBody,
      });
      return (await res.json()) as KakaoTokenDto;
    } catch (err: unknown) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_TOKEN_FAILED);
    }
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
   */
  private async getUser(accessToken: string): Promise<ProfileDto> {
    const res: any = await fetch(OAUTH_URL.KAKAO_USER, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': CONTENT_TYPE.KAKAO,
      },
    });
    const detail: any = { status: res.status, body: await res.json() };
    if (detail.status === 200) {
      return ProfileDto.fromKakao(detail.body.kakao_account);
    }
    throw new BadRequestException(ERR_MSG.OAUTH_KAKAO_USER_FAILED);
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info
   */
  private async getAccessTokenInfo(
    accessToken: string,
  ): Promise<KakaoAccessTokenInfoDto | null> {
    const res: any = await fetch(OAUTH_URL.KAKAO_ACCESS_TOKEN, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const detail: any = { status: res.status, body: await res.json() };
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
        Authorization: `Bearer ${accessToken}`,
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
