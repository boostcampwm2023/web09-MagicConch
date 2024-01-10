/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token-request-body
 */
export class RequestKakaoTokenDto {
  readonly grant_type: string = 'authorization_code';
  readonly client_id: string;
  readonly redirect_uri: string;
  readonly code: string;
  readonly client_secret: string;

  static fromInfo(
    clientId: string,
    redirectUri: string,
    code: string,
    clientSecret: string,
  ): RequestKakaoTokenDto {
    return {
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code,
      client_secret: clientSecret,
    };
  }
}
