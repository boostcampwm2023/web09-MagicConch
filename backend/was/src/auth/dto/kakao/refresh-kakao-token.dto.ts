/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#refresh-token-request-body
 */
export class RefreshKakaoTokenDto {
  readonly grant_type: string = 'refresh_token';
  readonly client_id: string;
  readonly refresh_token: string;
  readonly client_secret: string;

  static fromInfo(
    clientId: string,
    refreshToken: string,
    clientSecret: string,
  ): RefreshKakaoTokenDto {
    return {
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
      client_secret: clientSecret,
    };
  }
}
