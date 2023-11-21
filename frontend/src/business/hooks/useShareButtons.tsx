import { Kakao } from '../services/Kakao';
import { useParams } from 'react-router-dom';

export function useShareButtons({ card_url }: { card_url: string }) {
  const { id } = useParams();

  const shareKakao = async () => {
    await Kakao.init();
    await Kakao.shareSendDefault({ card_url, id: id as string });
  };

  const shareUrl = () => {};

  const downloadImage = () => {};

  const shareButtons = [
    {
      id: 'kakao',
      icon: 'simple-icons:kakaotalk',
      color: '#FEE500',
      handler: shareKakao,
    },
    {
      id: 'url',
      handler: shareUrl,
    },
    {
      id: 'download',
      handler: downloadImage,
    },
  ];

  return { shareButtons };
}
