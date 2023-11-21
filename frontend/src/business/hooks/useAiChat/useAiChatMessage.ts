import { useEffect, useState } from 'react';

import { Message, MessageButton } from '@components/ChatList';

import {
  sendMessage,
  setChatEndEventListener,
  setMessageEventListener,
  setMessageUpdateEventListener,
  setStreamEndEventListener,
  setTarotCardEventListener,
} from '@business/services/socket';

export function useAiChatMessage(tarotCardId: React.MutableRefObject<string | undefined>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  const addMessage = (type: 'left' | 'right', message: string, button?: MessageButton) => {
    const tarotId = tarotCardId.current;
    tarotCardId.current = undefined;

    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    setMessages(messages => [...messages, { type, message, profile, tarotId, button }]);
  };

  const updateMessage = (message: string) => {
    setInputDisabled(true);
    setMessages(messages => [...messages.slice(0, -1), { ...messages[messages.length - 1], message }]);
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    sendMessage(message);
  };

  useEffect(() => {
    setMessageEventListener(message => addMessage('left', message));
    setMessageUpdateEventListener(message => updateMessage(message));
    setStreamEndEventListener(() => setInputDisabled(false));
    setTarotCardEventListener(() => setInputDisabled(true));

    const button = { content: '피드백하기', onClick: () => alert('👩‍🔧') };
    setChatEndEventListener(message => addMessage('left', message, button));
  }, []);

  return { messages, inputDisabled, onSubmitMessage };
}
