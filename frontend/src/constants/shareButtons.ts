import { IconButton } from '@components/IconButton/IconButton';

export const RESULT_SHARE_ICON_SIZE = 20;

export const shareButtons: IconButton[] = [
  {
    id: 'kakao',
    text: '카카오톡 공유',
    icon: 'simple-icons:kakaotalk',
    iconColor: '#FEE500',
  },
  {
    id: 'download',
    text: '다운로드',
    icon: 'ic:round-download',
    iconColor: '',
  },
  {
    id: 'copyLink',
    text: 'copyLink',
    icon: 'bxs:copy',
    iconColor: '',
  },
];
