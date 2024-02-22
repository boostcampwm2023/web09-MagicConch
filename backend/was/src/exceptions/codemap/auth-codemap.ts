import { ExceptionCodemap } from './type';

export const AUTH_CODEMAP: ExceptionCodemap = {
  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
   */
  KAKAO_TOKEN_REQUEST_FAILED: {
    status: 400,
    message: '카카오 로그인에 실패했습니다.',
    code: 'MAE001',
    description: '카카오 토큰 발급에 실패했습니다.',
  },
  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#refresh-token
   */
  KAKAO_TOKEN_REFRESH_FAILED: {
    status: 400,
    message: '카카오 로그아웃에 실패했습니다.',
    code: 'MAE002',
    description: '카카오 토큰 갱신에 실패했습니다.',
  },
  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
   */
  KAKAO_USER_FAILED: {
    status: 400,
    message: '카카오 로그인에 실패했습니다.',
    code: 'MAE003',
    description: '카카오 사용자 정보 조회에 실패했습니다.',
  },
  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info
   */
  KAKAO_PLATFORM_ERROR: {
    status: 500,
    message: '카카오 로그아웃에 실패했습니다.',
    code: 'MAE004',
    description: '카카오 플랫폼에서 일시적인 장애가 발생했습니다.',
  },
  /**
   * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info
   */
  KAKAO_INVALID_ACCESS_TOKEN: {
    status: 500,
    message: '카카오 로그아웃에 실패했습니다.',
    code: 'MAE005',
    description:
      '카카오 액세스 토큰 정보 조회에 실패했습니다. 요청에 포함된 파라미터와 액세스 토큰을 확인해주세요.',
  },
};
