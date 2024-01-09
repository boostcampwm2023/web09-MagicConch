/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#kakaoaccount
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#profile
 */
export class KakaoAccount {
  readonly email: string;
  readonly nickname: string;
  readonly profileUrl: string;

  static fromAccount(account: any): KakaoAccount {
    return {
      email: account.email,
      nickname: account.profile.nickname,
      profileUrl: account.profile.profile_image_url ?? null,
    };
  }
}
