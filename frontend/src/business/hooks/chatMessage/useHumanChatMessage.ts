import { useChatMessage } from '.';
import { useDataChannel } from '../webRTC';
import { useEffect, useRef, useState } from 'react';

import { MessageButton } from '@components/common/ChatContainer';

import { ProfileInfo, useProfileInfo } from '@stores/zustandStores';

import { arrayBuffer2Blob } from '@utils/array';

import { HumanChatEvents } from '@constants/events';

const { PICK_CARD, CHAT_MESSAGE } = HumanChatEvents;

export function useHumanChatMessage() {
  const { dataChannels } = useDataChannel();
  const chatChannel = dataChannels.get('chatChannel');

  const { messages, pushMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);

  const myProfileRef = useRef<ProfileInfo>();
  const remoteProfileRef = useRef<ProfileInfo>();

  const { myProfile, remoteProfile } = useProfileInfo(state => ({
    myProfile: state.myProfile,
    remoteProfile: state.remoteProfile,
  }));

  myProfileRef.current = myProfile;
  remoteProfileRef.current = remoteProfile;

  const addMessage = (
    type: 'left' | 'right',
    options: { message?: string; tarotId?: number; button?: MessageButton },
  ) => {
    const profile = type === 'left' ? remoteProfileRef.current : myProfileRef.current;

    if (profile === undefined || profile.type === undefined) {
      const profileUrl = type === 'left' ? '/sponge.png' : '/ddung.png';
      pushMessage(type, profileUrl, { ...options });
      return;
    }
    const { arrayBuffer, type: profileType } = profile;
    const blob = arrayBuffer2Blob(arrayBuffer, profileType);
    const profileUrl = URL.createObjectURL(blob);
    pushMessage(type, profileUrl, { ...options });
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', { message });

    const payload = { type: CHAT_MESSAGE, content: message };
    chatChannel?.send(JSON.stringify(payload));
  };

  useEffect(() => {
    if (chatChannel) {
      chatChannel.addEventListener('open', () => {
        setInputDisabled(false);
      });

      chatChannel.addEventListener('close', () => {
        setInputDisabled(true);
      });

      chatChannel.addEventListener('message', (event: any) => {
        const message = JSON.parse(event.data);

        if (message.type === CHAT_MESSAGE) {
          addMessage('left', { message: message.content });
        }
        if (message.type === PICK_CARD) {
          addMessage('right', { tarotId: message.content });
        }
      });
    }
  }, [chatChannel]);

  const addPickCardMessage = (tarotId: number) => {
    addMessage('left', { tarotId });
  };

  return { messages, onSubmitMessage, inputDisabled, addPickCardMessage };
}
