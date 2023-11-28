import { useState } from 'react';

import type { Message, MessageButton } from '@components/ChatContainer';

export default function useChatMessage(tarotCardId: React.MutableRefObject<number | undefined>) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (type: 'left' | 'right', message: string, button?: MessageButton) => {
    const tarotId = tarotCardId.current;
    tarotCardId.current = undefined;

    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    setMessages(messages => [...messages, { type, message, profile, tarotId, button }]);
  };

  const updateMessage = (setMessage: (message: Message) => Message) => {
    setMessages(messages => [...messages.slice(0, -1), setMessage(messages[messages.length - 1])]);
  };

  return { messages, addMessage, updateMessage };
}
