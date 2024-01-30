/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info-response
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#kakaoaccount
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#profile
 */
export class ProfileDto {
  readonly email: string;
  readonly nickname: string;
  readonly profileUrl?: string;

  static fromKakao(account: any): ProfileDto {
    return {
      email: account.email,
      nickname: account.profile.nickname,
      profileUrl: account.profile.picture,
    };
  }
}
