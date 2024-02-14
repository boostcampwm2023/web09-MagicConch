export const BUCKET_URL: string =
  'https://kr.object.ncloudstorage.com/magicconch';

export enum ProviderName {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
}

export enum ProviderIdEnum {
  KAKAO = 0,
  NAVER = 1,
  GOOGLE = 2,
}

export enum ExtEnum {
  JPG = 0,
  PNG = 1,
}

export const ExtArray = Object.values(ExtEnum);
