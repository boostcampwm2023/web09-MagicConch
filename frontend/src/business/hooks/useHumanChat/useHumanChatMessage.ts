import useChatMessage from '../useChatMessage';
import { useEffect, useState } from 'react';

export default function useHumanChatMessage(
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

    const payload = { type: 'message', message };
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
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
          addMessage('left', data.message);
        }

        if (data.type == 'pickCard') {
          pushMessage({ type: 'right', profile: '/sponge.png', tarotId: data.tarotId });
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
