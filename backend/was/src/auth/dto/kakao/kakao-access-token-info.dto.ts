/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info-response-body
 */
export class KakaoAccessTokenInfoDto {
  readonly id: number;
  readonly expires_in: number;
  readonly app_id: number;
}
