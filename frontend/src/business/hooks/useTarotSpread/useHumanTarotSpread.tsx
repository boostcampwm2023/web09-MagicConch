import { useEffect, useState } from 'react';

import Popup from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { HumanChatEvents } from '@constants/events';
import { POPUP_MESSAGE } from '@constants/messages';

import useDisplayTarotCard from './useDisplayTarotCard';
import { useTarotSpread } from './useTarotSpread';

const { PICK_CARD, TAROT_SPREAD } = HumanChatEvents;

export function useHumanTarotSpread(chatChannel: RTCDataChannel | undefined, onPickCard: (idx: number) => void) {
  const [tarotButtonDisabled, setTarotButtonDisabled] = useState(true);

  const pickCard = (idx: number) => {
    const payload = { type: PICK_CARD, content: idx };
    chatChannel?.send(JSON.stringify(payload));
    onPickCard(idx);
  };

  const { openTarotSpread } = useTarotSpread(pickCard);
  const { displayTarotCard } = useDisplayTarotCard();

  const { open } = useOverlay();

  const tarotButtonClick = () => {
    open(({ close }) => (
      <Popup
        onCancel={() => close()}
        onConfirm={() => {
          close();
          requestTarotSpread();
        }}
      >
        {POPUP_MESSAGE.SPREAD_TAROT_CARD}
      </Popup>
    ));
  };

  const requestTarotSpread = () => {
    setTarotButtonDisabled(true);
    const payload = { type: TAROT_SPREAD };
    chatChannel?.send(JSON.stringify(payload));
  };

  useEffect(() => {
    if (chatChannel) {
      chatChannel.addEventListener('open', () => {
        setTarotButtonDisabled(false);
      });

      chatChannel.addEventListener('close', () => {
        setTarotButtonDisabled(true);
      });

      chatChannel.addEventListener('message', event => {
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
  }, [chatChannel]);

  return { tarotButtonClick, tarotButtonDisabled };
}
