export const BUCKET_URL: string =
  'https://kr.object.ncloudstorage.com/magicconch';

type Provider = 'KAKAO' | 'NAVER' | 'GOOGLE';

export const PROVIDER_ID: Record<Provider, number> = {
  KAKAO: 0,
  NAVER: 1,
  GOOGLE: 2,
};

export const PROVIDER_NAME: Record<Provider, Provider> = {
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
  GOOGLE: 'GOOGLE',
};
