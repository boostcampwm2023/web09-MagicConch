/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#KakaoAccountDto
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#profile
 */
export class KakaoAccountDto {
  readonly email: string;
  readonly nickname: string;
  readonly profileUrl: string;

  static fromAccount(account: any): KakaoAccountDto {
    return {
      email: account.email,
      nickname: account.profile.nickname,
      profileUrl: account.profile.profile_image_url ?? null,
    };
  }

  static fromOIDCuserInfo(userInfo: any): KakaoAccountDto {
    return {
      email: userInfo.email,
      nickname: userInfo.nickname,
      profileUrl: userInfo.picture ?? null,
    };
  }
}
