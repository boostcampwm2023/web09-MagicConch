export const iconColorMap = {
  textStrong: 'text-strong',
  textBold: 'text-bold',
  textDefault: 'text-default',
  textWeak: 'text-weak',
  textWhite: 'text-white-default',
  kakaoIcon: 'kakao-icon',
};

export type IconColor = keyof typeof iconColorMap;

export const ButtonColorMap: Record<string, string> = {
  active: 'surface-point-alt text-white',
  cancel: 'surface-disabled text-white',
  disabled: 'surface-box text-weak',
  dark: 'surface-alt text-white',
  transparent: 'bg-transparent hover:bg-transparent hover:border-transparent',
  kakao: 'surface-kakao text-kakao',
};

export type ButtonColor = keyof typeof ButtonColorMap;
