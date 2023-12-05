import { detect } from 'detect-browser';

export const RESULT_SHARE_ICON_SIZE = 20;

export const TAROT_CARDS_LENGTH = 78;

const browser = detect();
const __MAC__ = browser?.os?.includes('Mac');

export type ButtonSize = 's' | 'm' | 'l';

export const defaultButtonSizeMap: Record<ButtonSize, string> = {
  s: `h-40 min-h-0 display-bold14 ${__MAC__ ? 'leading-18' : ''} p-8 `,
  m: `h-50 display-bold16 ${__MAC__ ? 'leading-20' : ''} p-16`,
  l: `h-60 display-bold16 ${__MAC__ ? 'leading-30' : ''} p-16`,
};

export const circleButtonSizeMap: Record<ButtonSize, string> = {
  s: 'h-40 w-40 p-0',
  m: 'h-50 w-50 p-0',
  l: 'h-60 w-60 p-0',
};
