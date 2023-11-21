import { Kakao } from '../services/Kakao';
import { useParams } from 'react-router-dom';

interface ShareButton {
  id: string;
  name: string;
  icon: string;
  color: string;
  handler: () => void;
}

export function useShareButtons({ card_url }: { card_url: string }) {
  const { id } = useParams();

  const shareKakao = async () => {
    await Kakao.init();
    await Kakao.shareSendDefault({ card_url, id: id as string });
  };

  const shareUrl = () => {};

  const downloadImage = () => {};

  const shareButtons: ShareButton[] = [
    {
      id: 'kakao',
      name: '카카오톡 공유',
      icon: 'simple-icons:kakaotalk',
      color: '#FEE500',
      handler: shareKakao,
    },
    {
      id: 'download',
      name: '다운로드',
      icon: 'ic:round-download',
      color: '',
      handler: downloadImage,
    },
    {
      id: 'copyLink',
      name: 'copyLink',
      icon: 'bxs:copy',
      color: '',
      handler: shareUrl,
    },
  ];

  return { shareButtons };
}
