import { RefObject } from 'react';
import { useParams } from 'react-router-dom';

import { Kakao } from '@business/services/Kakao';

import { downloadImage } from '@utils/downloadImage';

export function useShareButtons({
  cardUrl,
  resultSharePageRef,
}: {
  cardUrl: string;
  resultSharePageRef: RefObject<HTMLDivElement>;
}) {
  const { id } = useParams<{ id: string }>();

  const share2Kakao = async () => {
    await Kakao.init();
    await Kakao.shareSendDefault({ cardUrl, id: id as string });
  };

  const download = () => {
    downloadImage(resultSharePageRef);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}/result/${id}`);
  };

  const shareButtons = {
    kakao: {
      text: '카카오톡 공유',
      icon: 'simple-icons:kakaotalk',
      iconColor: '#FEE500',
      onClick: share2Kakao,
      tooltip: '',
    },
    download: {
      text: '다운로드',
      icon: 'ic:round-download',
      iconColor: '',
      onClick: download,
      tooltip: '',
    },
    copyLink: {
      text: 'copyLink',
      icon: 'bxs:copy',
      iconColor: '',
      onClick: copyLink,
      tooltip: '클립보드에 복사됩니다.',
    },
  };

  return { shareButtons };
}
