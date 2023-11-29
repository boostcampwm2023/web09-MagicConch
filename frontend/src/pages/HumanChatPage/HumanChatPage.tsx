import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useHumanChatMessage, useHumanTarotSpread } from '@business/hooks/useHumanChat';
import { useWebRTC } from '@business/hooks/useWebRTC';

export interface OutletContext extends ReturnType<typeof useWebRTC> {
  requestTarotSpread: () => void;
}

export default function HumanChatPage() {
  const { roomName } = useParams();
  const webRTCData = useWebRTC(roomName as string);

  const [tarotId, setTarotId] = useState<number>();

  const { requestTarotSpread } = useHumanTarotSpread(webRTCData.chatChannel, setTarotId);
  const { messages, onSubmitMessage, inputDisabled } = useHumanChatMessage(webRTCData.chatChannel, tarotId, setTarotId);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar key="chat-side-bar">
            <ChatContainer
              width="w-400"
              height="h-4/5"
              position="top-40"
              messages={messages}
              onSubmitMessage={onSubmitMessage}
              inputDisabled={inputDisabled}
            />
          </SideBar>,
        ]}
      />
      <Outlet context={{ ...webRTCData, requestTarotSpread }} />
    </Background>
  );
}
