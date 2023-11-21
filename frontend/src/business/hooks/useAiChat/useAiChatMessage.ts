import { useEffect, useState } from 'react';

import { Message } from '@components/ChatList/ChatList';

import {
  sendMessage,
  setMessageEventListener,
  setMessageUpdateEventListener,
  setStreamEndEventListener,
} from '@business/services/socket';

export function useAiChatMessage(tarotCardId: React.MutableRefObject<string | undefined>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStreaming, setMessageStreaming] = useState(false);

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
  }, []);

  return { messages, messageStreaming, onSubmitMessage };
}