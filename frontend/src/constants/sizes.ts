import { __MAC__ } from './browser';

export const RESULT_SHARE_ICON_SIZE = 20;
export const TAROT_CARDS_LENGTH = 78;

export type ButtonSize = 's' | 'm' | 'l';

export const buttonSizeMap: Record<ButtonSize, string> = {
  s: `display-bold14 p-8 ${__MAC__ ? 'leading-18' : ''}`,
  m: `display-bold16 p-12 ${__MAC__ ? 'leading-20' : ''}`,
  l: `display-bold16 p-16 ${__MAC__ ? 'leading-30' : ''}`,
};

export const iconSizeMap: Record<ButtonSize, string> = {
  s: '24',
  m: '28',
  l: '32',
};
