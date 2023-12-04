import { useEffect, useState } from 'react';

import { HumanChatEvents } from '@constants/events';

import useChatMessage from './useChatMessage';

const { PICK_CARD, CHAT_MESSAGE } = HumanChatEvents;

export function useHumanChatMessage(
  chatChannel: React.MutableRefObject<RTCDataChannel | undefined>,
  tarotId: number | undefined,
  setTarotId: (tarotId: number | undefined) => void,
) {
  const { messages, pushMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);

  const addMessage = (type: 'left' | 'right', message: string) => {
    // TODO: host인지에 따라서 프로필 사진을 다르게 해야함
    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    pushMessage({ type, message, profile });
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);

    const payload = { type: CHAT_MESSAGE, content: message };
    chatChannel.current?.send(JSON.stringify(payload));
  };

  useEffect(() => {
    if (chatChannel.current) {
      chatChannel.current.addEventListener('open', () => {
        setInputDisabled(false);
      });

      chatChannel.current.addEventListener('close', () => {
        setInputDisabled(true);
      });

      chatChannel.current.addEventListener('message', event => {
        const message = JSON.parse(event.data);

        if (message.type === CHAT_MESSAGE) {
          addMessage('left', message.content);
        }
        if (message.type == PICK_CARD) {
          pushMessage({ type: 'right', profile: '/sponge.png', tarotId: message.content });
        }
      });
    }
  }, [chatChannel.current]);

  useEffect(() => {
    if (tarotId) {
      // TODO: host인지에 따라서 프로필 사진을 다르게 해야함
      pushMessage({ type: 'left', tarotId, profile: '/sponge.png' });
      setTarotId(undefined);
    }
  }, [tarotId]);

  return { messages, onSubmitMessage, inputDisabled };
}
