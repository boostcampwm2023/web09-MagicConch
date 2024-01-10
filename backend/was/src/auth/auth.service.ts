import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CONTENT_TYPE, METHODS, OAUTH_URL } from 'src/common/constants/apis';
import { ERR_MSG } from 'src/common/constants/errors';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { KakaoAccountDto } from './dto/kakao/kakao-account.dto';
import { KakaoTokenReqDto } from './dto/kakao/kakao-token-req.dto';
import { KakaoTokenDto } from './dto/kakao/kakao-token.dto';

@Injectable()
export class AuthService {
  private readonly kakaoClientId: string;
  private readonly kakaoRedirectUri: string;
  private readonly kakaoClientSecret: string;

  constructor(
    @InjectRepository(Member)
    private readonly membersService: MembersService,
    private readonly configService: ConfigService,
  ) {
    this.kakaoClientId = this.configService.get('KAKAO_CLIENT_ID') ?? '';
    this.kakaoRedirectUri = this.configService.get('KAKAO_REDIRECT_URI') ?? '';
    this.kakaoClientSecret =
      this.configService.get('KAKAO_CLIENT_SECRET') ?? '';
  }

  async loginKakao(code: string): Promise<AccessTokenDto> {
    const token: KakaoTokenDto = await this.getKakaoToken(code);
    const account: KakaoAccountDto = await this.getOIDCuserInfo(
      token.access_token,
    );
    const member: Member | null = await this.membersService.findByEmail(
      account.email,
    );
    if (member) {
      this.renewRefreshToken(member.id, token);
    }
    return this.signupKakao(account, token);
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#logout
   */
  async logoutKakao(accessToken: string): Promise<boolean> {
    try {
      await fetch(OAUTH_URL.KAKAO_LOGOUT, {
        method: METHODS.POST,
        headers: {
          Authorization: `Authorization: Bearer ${accessToken}`,
          'Content-type': CONTENT_TYPE.KAKAO,
        },
      });
      return true;
    } catch (err: unknown) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_LOGOUT_FAILED);
    }
  }

  private async signupKakao(
    account: KakaoAccountDto,
    token: KakaoTokenDto,
  ): Promise<AccessTokenDto> {
    const createMemberDto: CreateMemberDto = CreateMemberDto.fromKakao(
      token.refresh_token,
      account,
    );
    await this.membersService.create(createMemberDto);
    return { token: token.access_token, expiresIn: token.expires_in };
  }

  private async renewRefreshToken(
    id: string,
    token: KakaoTokenDto,
  ): Promise<AccessTokenDto> {
    /**
     * TODO : 무조건 갱신해도 되는 건가?
     */
    await this.membersService.updateRefreshToken(id, token.refresh_token);
    return { token: token.access_token, expiresIn: token.expires_in };
  }

  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
   */
  private async getKakaoToken(code: string): Promise<KakaoTokenDto> {
    const reqBody: KakaoTokenReqDto = KakaoTokenReqDto.fromInfo(
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
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#oidc-user-info
   */
  private async getOIDCuserInfo(accessToken: string): Promise<KakaoAccountDto> {
    try {
      const res: any = await fetch(OAUTH_URL.KAKAO_OIDC_USERINFO, {
        headers: { Authorization: `Authorization: Bearer ${accessToken}` },
      });
      const resBody: any = await res.json();
      return KakaoAccountDto.fromOIDCuserInfo(resBody);
    } catch (err: unknown) {
      throw new UnauthorizedException(
        ERR_MSG.OAUTH_KAKAO_OIDC_USER_INFO_FAILED,
      );
    }
  }
}
