export const METHODS = {
  GET: 'GET',
  POST: 'POST',
};

export const CONTENT_TYPE = {
  KAKAO: 'application/x-www-form-urlencoded;charset=utf-8',
};

export const OAUTH_URL = {
  /**
   * kakao
   */
  KAKAO_USER: 'https://kapi.kakao.com/v2/user/me',
  KAKAO_TOKEN: 'https://kauth.kakao.com/oauth/token',
  KAKAO_ACCESS_TOKEN: 'https://kapi.kakao.com/v1/user/access_token_info',
  KAKAO_LOGOUT: 'https://kapi.kakao.com/v1/user/logout',
  KAKAO_LOGOUT_ALL: 'https://kauth.kakao.com/oauth/logout',
};
