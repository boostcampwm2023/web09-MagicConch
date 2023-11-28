import { useState } from 'react';

import type { Message } from '@components/ChatContainer';

export default function useChatMessage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const pushMessage = (message: Message) => {
    setMessages(messages => [...messages, message]);
  };

  const updateMessage = (setMessage: (message: Message) => Message) => {
    setMessages(messages => [...messages.slice(0, -1), setMessage(messages[messages.length - 1])]);
  };

  return { messages, pushMessage, updateMessage };
}
