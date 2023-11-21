import useOverlay from './useOverlay';
import { useEffect, useRef, useState } from 'react';

import { Message } from '@components/ChatList/ChatList';
import TarotSpread from '@components/TarotSpread';

import {
  requestTarotRead,
  sendMessage,
  setMessageEventListener,
  setMessageUpdateEventListener,
  setStreamEndEventListener,
  setTarotCardEventListener,
} from '@business/services/socket';

import { tarotCardNames } from '@constants/tarotCardNames';

export function useAiChat() {
  const { open } = useOverlay();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStreaming, setMessageStreaming] = useState(false);

  const tarotCardId = useRef<string | undefined>(undefined);

  const pickCard = (idx: number) => {
    console.log(idx);
    const random = Math.floor(Math.random() * tarotCardNames.length);
    requestTarotRead(`${random}번 ${tarotCardNames[random]}카드`);
    tarotCardId.current = random.toString().padStart(2, '0');
  };

  const openTarotSpread = () => {
    open(({ opened, close }) => (
      <TarotSpread
        opened={opened}
        close={close}
        pickCard={pickCard}
      />
    ));
  };

  const addMessage = (type: 'left' | 'right', message: string) => {
    const tarotId = tarotCardId.current;
    tarotCardId.current = undefined;

    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    setMessages(messages => [...messages, { type, message, profile, tarotId }]);
  };

  const updateMessage = (message: string) => {
    setMessageStreaming(true);
    setMessages(messages => [...messages.slice(0, -1), { ...messages[messages.length - 1], message }]);
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    sendMessage(message);
  };

  useEffect(() => {
    setMessageEventListener(message => addMessage('left', message));
    setMessageUpdateEventListener(message => updateMessage(message));
    setStreamEndEventListener(() => setMessageStreaming(false));
    setTarotCardEventListener(() => openTarotSpread());
  }, []);

  return { messages, messageStreaming, onSubmitMessage };
}
