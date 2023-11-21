import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Kakao } from '@business/services/Kakao';

import { downloadImage } from '@utils/downloadImage';

export function useResultSharePageButtonHandlers(cardUrl: string) {
  const { id } = useParams<{ id: string }>();

  const resultSharePageRef = useRef<HTMLDivElement>(null);

  const handlers = [
    async () => {
      await Kakao.init();
      await Kakao.shareSendDefault({ cardUrl, id: id as string });
    },
    async () => {
      downloadImage(resultSharePageRef);
    },
    () => {
      console.log('click copy');
    },
  ];

  return { resultSharePageRef, handlers };
}
