import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CONTENT_TYPE, METHODS, OAUTH_URL } from 'src/common/constants/apis';
import { ERR_MSG } from 'src/common/constants/errors';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';
import { UpdateMemberDto } from 'src/members/dto/update-member.dto';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { KakaoAccessTokenInfoDto } from './dto/kakao/kakao-access-token-info.dto';
import { KakaoTokenDto } from './dto/kakao/kakao-token.dto';
import { RefreshKakaoTokenDto } from './dto/kakao/refresh-kakao-token.dto';
import { RequestKakaoTokenDto } from './dto/kakao/request-kakao-token.dto';
import { OAuthTokenDto } from './dto/oauth-token.dto';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class AuthService {
  private readonly kakaoClientId: string;
  private readonly kakaoRedirectUri: string;
  private readonly kakaoClientSecret: string;

  constructor(
    @InjectRepository(Member)
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.kakaoClientId = this.configService.get('KAKAO_CLIENT_ID') ?? '';
    this.kakaoRedirectUri = this.configService.get('KAKAO_REDIRECT_URI') ?? '';
    this.kakaoClientSecret =
      this.configService.get('KAKAO_CLIENT_SECRET') ?? '';
  }

  async loginKakao(code: string): Promise<string> {
    const token: KakaoTokenDto = await this.requestKakaoToken(code);
    const profile: ProfileDto = await this.getKakaoOIDCuserInfo(
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

  async logout(token: string) {
    const payload: JwtPayloadDto = this.verfiyToken(token);
    const member: Member | null = await this.membersService.findByEmail(
      payload.email,
      payload.providerId,
    );
    switch (payload.providerId) {
      case PROVIDER_ID.KAKAO:
        return this.logoutKakao(
          payload.accessToken,
          member ? member.refreshToken : '',
        );
      case PROVIDER_ID.NAVER:
        break;
      case PROVIDER_ID.GOOGLE:
        break;
    }
  }

  private async signup(
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): Promise<string> {
    const createMemberDto: CreateMemberDto = CreateMemberDto.fromProfile(
      providerId,
      token.refresh_token,
      profile,
    );
    await this.membersService.create(createMemberDto);
    return this.makeToken(profile.email, providerId, token.access_token);
  }

  private async login(
    id: string,
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): Promise<string> {
    await this.membersService.update(
      id,
      UpdateMemberDto.fromProfile(providerId, token.refresh_token, profile),
    );
    return this.makeToken(profile.email, providerId, token.access_token);
  }

  private async logoutKakao(
    accessToken: string,
    refreshToken: string,
  ): Promise<boolean> {
    const tokenInfo: KakaoAccessTokenInfoDto | null =
      await this.getKakaoAccessTokenInfo(accessToken);
    if (tokenInfo) {
      return this.requestKakaoLogout(accessToken);
    }
    const newToken: KakaoTokenDto = await this.refreshKakaoToken(refreshToken);
    return this.requestKakaoLogout(newToken.access_token);
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
   */
  private async requestKakaoToken(code: string): Promise<KakaoTokenDto> {
    const reqBody: RequestKakaoTokenDto = RequestKakaoTokenDto.fromInfo(
      this.kakaoClientId,
      this.kakaoRedirectUri,
      code,
      this.kakaoClientSecret,
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
  private async refreshKakaoToken(
    refreshToken: string,
  ): Promise<KakaoTokenDto> {
    const reqBody: RefreshKakaoTokenDto = RefreshKakaoTokenDto.fromInfo(
      this.kakaoClientId,
      refreshToken,
      this.kakaoClientSecret,
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
  private async getKakaoOIDCuserInfo(idToken: string): Promise<ProfileDto> {
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
  private async getKakaoAccessTokenInfo(
    accessToken: string,
  ): Promise<KakaoAccessTokenInfoDto | null> {
    const res: any = await fetch(OAUTH_URL.KAKAO_ACCESS_TOKEN, {
      headers: { Authorization: `Authorization: Bearer ${accessToken}` },
    });
    const detail: any = { status: res.code, body: await res.json() };
    if (detail.status === 200) {
      return detail.body as KakaoAccessTokenInfoDto;
    }
    return this.handleKakaoAccessTokenInfoError(
      detail.status,
      detail.body.code,
    );
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#logout
   */
  private async requestKakaoLogout(accessToken: string): Promise<boolean> {
    await fetch(OAUTH_URL.KAKAO_LOGOUT, {
      method: METHODS.POST,
      headers: {
        Authorization: `Authorization: Bearer ${accessToken}`,
        'Content-type': CONTENT_TYPE.KAKAO,
      },
    });
    return true;
  }

  private handleKakaoAccessTokenInfoError(status: number, code: number): null {
    if (status === 401) {
      return null;
    }
    throw new InternalServerErrorException(
      code === -1
        ? ERR_MSG.OAUTH_KAKAO_ACCESS_TOKEN_INFO_KAKAO_ERROR
        : ERR_MSG.OAUTH_KAKAO_ACCESS_TOKEN_INFO_BAD_REQUEST,
    );
  }

  private makeToken(
    email: string,
    providerId: number,
    accessToken: string,
  ): string {
    const payload: JwtPayloadDto = JwtPayloadDto.fromInfo(
      email,
      providerId,
      accessToken,
    );
    return this.signPayload(payload);
  }

  private signPayload(payload: JwtPayloadDto): string {
    return this.jwtService.sign(payload);
  }

  private verfiyToken(token: string): JwtPayloadDto {
    return this.jwtService.verify(token);
  }
}
