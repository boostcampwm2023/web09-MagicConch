import { useTarotSpread } from '../useTarotSpread';
import { useEffect } from 'react';

import { HumanChatEvents } from '@constants/events';

const { PICK_CARD, TAROT_SPREAD } = HumanChatEvents;

export default function useHumanTarotSpread(
  chatChannel: React.MutableRefObject<RTCDataChannel | undefined>,
  setTarotId: (idx: number) => void,
) {
  const pickCard = (idx: number) => {
    const payload = { type: PICK_CARD, content: idx };
    chatChannel.current?.send(JSON.stringify(payload));
    setTarotId(idx);
  };

  const requestTarotSpread = () => {
    const payload = { type: TAROT_SPREAD };
    chatChannel.current?.send(JSON.stringify(payload));
  };

  const { openTarotSpread } = useTarotSpread(pickCard);

  useEffect(() => {
    if (chatChannel.current) {
      chatChannel.current.addEventListener('message', event => {
        const data = JSON.parse(event.data);

        if (data.type === TAROT_SPREAD) {
          setTimeout(openTarotSpread, 1000);
        }
      });
    }
  }, [chatChannel.current]);

  return { requestTarotSpread };
}
