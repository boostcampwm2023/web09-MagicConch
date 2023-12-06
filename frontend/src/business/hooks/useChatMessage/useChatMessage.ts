import { useState } from 'react';

import type { Message, MessageButton } from '@components/ChatContainer';

export default function useChatMessage() {
  const [messages, setMessages] = useState<Message[]>([]);

  type pushMessageOptions = {
    message?: string;
    button?: MessageButton;
    tarotId?: number;
  };
  const pushMessage = (type: 'left' | 'right', profile: string, options: pushMessageOptions) => {
    setMessages(messages => [...messages, { type, profile, ...options }]);
  };

  const updateMessage = (setMessage: (message: Message) => Message) => {
    setMessages(messages => [...messages.slice(0, -1), setMessage(messages[messages.length - 1])]);
  };

  return { messages, pushMessage, updateMessage };
}
