import { useTarotSpread } from '../useTarotSpread';
import { useEffect } from 'react';

export default function useHumanTarotSpread(
  chatChannel: React.MutableRefObject<RTCDataChannel | undefined>,
  setTarotId: (idx: number) => void,
) {
  const pickCard = (idx: number) => {
    const payload = { type: 'pickCard', tarotId: idx };
    chatChannel.current?.send(JSON.stringify(payload));
    setTarotId(idx);
  };

  const requestTarotCard = () => {
    const payload = { type: 'tarotCard' };
    chatChannel.current?.send(JSON.stringify(payload));
  };

  const { openTarotSpread } = useTarotSpread(pickCard);

  useEffect(() => {
    if (chatChannel.current) {
      chatChannel.current.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        if (data.type === 'tarotCard') {
          setTimeout(openTarotSpread, 1000);
        }
      };
    }
  }, []);

  return { requestTarotCard };
}
