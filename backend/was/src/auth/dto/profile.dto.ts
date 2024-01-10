/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#kakaoaccount
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#profile
 */
export class ProfileDto {
  readonly email: string;
  readonly nickname: string;
  readonly profileUrl: string;

  static fromKakao(userInfo: any): ProfileDto {
    return {
      email: userInfo.email,
      nickname: userInfo.nickname,
      profileUrl: userInfo.picture ?? null,
    };
  }
}
