import { KakaoTokenDto } from './kakao';

export class OAuthTokenDto {
  readonly token_type: string;
  readonly access_token: string;
  readonly id_token?: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly refresh_token_expires_in: number;
  readonly scope?: string;

  static fromKakao(kakao: KakaoTokenDto): OAuthTokenDto {
    return {
      token_type: kakao.token_type,
      access_token: kakao.access_token,
      id_token: kakao.id_token,
      expires_in: kakao.expires_in,
      refresh_token: kakao.refresh_token,
      refresh_token_expires_in: kakao.refresh_token_expires_in,
      scope: kakao.scope,
    };
  }
}
