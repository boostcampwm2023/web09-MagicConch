import { useState } from 'react';

import type { Message, MessageButton } from '@components/ChatContainer';

export default function useChatMessage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const pushMessage = (message: Message) => {
    setMessages(messages => [...messages, message]);
  };

  type addMessageOptions = {
    message?: string;
    button?: MessageButton;
    tarotId?: number;
  };
  const addMessage = (type: 'left' | 'right', options: addMessageOptions = {}) => {
    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    pushMessage({ type, profile, ...options });
  };

  const updateMessage = (setMessage: (message: Message) => Message) => {
    setMessages(messages => [...messages.slice(0, -1), setMessage(messages[messages.length - 1])]);
  };

  return { messages, addMessage, updateMessage };
}
