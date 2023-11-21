import { RefObject } from 'react';
import { useParams } from 'react-router-dom';

import IconButton from '@components/IconButton';

import { Kakao } from '@business/services/Kakao';

import { downloadImage } from '@utils/downloadImage';

import { RESULT_SHARE_ICON_SIZE } from '@constants/sizes';

interface ShareButtonListProps {
  cardUrl: string;
  resultSharePageRef: RefObject<HTMLDivElement>;
}

export function ShareButtonList({ cardUrl, resultSharePageRef }: ShareButtonListProps) {
  const { id } = useParams<{ id: string }>();

  const share = {
    kakao: {
      text: '카카오톡 공유',
      icon: 'simple-icons:kakaotalk',
      iconColor: '#FEE500',
      onClick: async () => {
        await Kakao.init();
        await Kakao.shareSendDefault({ cardUrl, id: id as string });
      },
    },
    download: {
      text: '다운로드',
      icon: 'ic:round-download',
      iconColor: '',
      onClick: () => {
        downloadImage(resultSharePageRef);
      },
    },
    copyLink: {
      text: 'copyLink',
      icon: 'bxs:copy',
      iconColor: '',
      onClick: () => {},
    },
  };

  return (
    <ul className="w-full h-110 rounded-b-2xl flex flex-all-center gap-12 ignore-html2canvas">
      {Object.entries(share).map(([key, value]) => (
        <li key={key}>
          <IconButton
            text={value.text}
            icon={value.icon}
            iconColor={value.iconColor}
            iconSize={RESULT_SHARE_ICON_SIZE}
            onClick={value.onClick}
          />
        </li>
      ))}
    </ul>
  );
}
