import { Kakao } from '../services/Kakao';
import { loadScript } from '../services/loadScript';
import { useParams } from 'react-router-dom';

export function useShareButtons({ card_url }: { card_url: string }) {
  const { id } = useParams();

  const shareKakao = async () => {
    await Kakao.init();
    await Kakao.shareSendDefault({ card_url, id: id as string });
  };

  const shareInstagram = () => {
    // TODO: 인스타 스크립트 로딩
    loadScript('');
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
      id: 'instagram',
      icon: 'skill-icons:instagram',
      handler: shareInstagram,
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
