export const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js';
export const KAKAO_SDK_INTERGRITY = 'sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4';

export const KAKAO_AUTH_URL =
  'https://kauth.kakao.com/oauth/authorize?response_type=code' +
  `&client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}` +
  `&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`;

export const KAKAO_LOGIN_URL = import.meta.env.VITE_WAS_URL + '/oauth/login/kakao';
export const KAKAO_LOGOUT_URL = import.meta.env.VITE_WAS_URL + '/oauth/logout';
