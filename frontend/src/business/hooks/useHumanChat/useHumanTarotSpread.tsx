import useDisplayTarotCard from '../useDisplayTarotCard';
import useOverlay from '../useOverlay';
import { useTarotSpread } from '../useTarotSpread';
import { useEffect, useState } from 'react';

import Popup from '@components/Popup';

import { HumanChatEvents } from '@constants/events';

const { PICK_CARD, TAROT_SPREAD } = HumanChatEvents;

export default function useHumanTarotSpread(
  chatChannel: React.MutableRefObject<RTCDataChannel | undefined>,
  setTarotId: (idx: number) => void,
) {
  const [tarotButtonDisabled, setTarotButtonDisabled] = useState(true);

  const pickCard = (idx: number) => {
    const payload = { type: PICK_CARD, content: idx };
    chatChannel.current?.send(JSON.stringify(payload));
    setTarotId(idx);
  };

  const { openTarotSpread } = useTarotSpread(pickCard);
  const { displayTarotCard } = useDisplayTarotCard();

  const { open } = useOverlay();

  const tarotButtonClick = () => {
    open(({ close }) => (
      <Popup
        close={close}
        onConfirm={requestTarotSpread}
      >
        상담자에게 타로 카드가 펼쳐집니다.
      </Popup>
    ));
  };

  const requestTarotSpread = () => {
    setTarotButtonDisabled(true);
    const payload = { type: TAROT_SPREAD };
    chatChannel.current?.send(JSON.stringify(payload));
  };

  useEffect(() => {
    if (chatChannel.current) {
      chatChannel.current.addEventListener('open', () => {
        console.log('chat channel opened');
        setTarotButtonDisabled(false);
      });

      chatChannel.current.addEventListener('message', event => {
        const message = JSON.parse(event.data);

        if (message.type === TAROT_SPREAD) {
          setTimeout(openTarotSpread, 1000);
        }
        if (message.type === PICK_CARD) {
          setTimeout(() => setTarotButtonDisabled(false), 5000);
          displayTarotCard(message.content);
        }
      });
    }
  }, [chatChannel.current]);

  return { tarotButtonClick, tarotButtonDisabled };
}
