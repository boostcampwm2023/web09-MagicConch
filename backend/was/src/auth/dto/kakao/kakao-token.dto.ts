/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token-response
 */
export class KakaoTokenDto {
  readonly token_type: string;
  readonly access_token: string;
  readonly id_token?: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly refresh_token_expires_in: number;
  readonly scope?: string;
}
