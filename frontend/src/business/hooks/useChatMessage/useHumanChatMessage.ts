import { useEffect, useState } from 'react';

import { MessageButton } from '@components/ChatContainer';

import { useHost } from '@stores/zustandStores/useHost';

import { HumanChatEvents } from '@constants/events';

import useChatMessage from './useChatMessage';

const { PICK_CARD, CHAT_MESSAGE } = HumanChatEvents;

export function useHumanChatMessage(chatChannel: React.MutableRefObject<RTCDataChannel | undefined>) {
  const { messages, pushMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);

  const { host } = useHost(state => ({ host: state.host }));

  const addMessage = (
    type: 'left' | 'right',
    options: { message?: string; tarotId?: number; button?: MessageButton },
  ) => {
    const hostSetting = type === 'left' ? '/ddung.png' : '/moon.png';
    const notHostSetting = type === 'left' ? '/moon.png' : '/ddung.png';

    const profile = host ? hostSetting : notHostSetting;

    pushMessage(type, profile, options);
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', { message });

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
          addMessage('left', { message: message.content });
        }
        if (message.type === PICK_CARD) {
          addMessage('right', { tarotId: message.content });
        }
      });
    }
  }, [chatChannel.current]);

  const addPickCardMessage = (tarotId: number) => {
    addMessage('left', { tarotId });
  };

  return { messages, onSubmitMessage, inputDisabled, addPickCardMessage };
}
