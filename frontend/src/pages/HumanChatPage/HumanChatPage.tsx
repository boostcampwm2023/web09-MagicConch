import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useWebRTC } from '@business/hooks/useWebRTC';

export type OutletContext = ReturnType<typeof useWebRTC>;

export default function HumanChatPage() {
  const { roomName } = useParams();
  const webRTCData = useWebRTC(roomName as string);

  const [opendSidebar, setOpendSidebar] = useState<boolean>();

  const contentAnimation =
    opendSidebar === undefined
      ? ''
      : opendSidebar
      ? 'animate-contentSideWithOpeningSidebar'
      : 'animate-contentSideWithClosingSidebar';

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar
            key="chat-side-bar"
            onSide={setOpendSidebar}
          >
            <ChatContainer
              width="w-400"
              height="h-4/5"
              position="top-40"
              // TODO: useHuman~에서 값을 가져와서 넣어주어야 함
              messages={[]}
              inputDisabled={true}
              onSubmitMessage={() => {}}
            />
          </SideBar>,
        ]}
      />
      <div className="w-h-screen">
        <div className={`flex-with-center h-full ${contentAnimation}`}>
          <Outlet context={webRTCData} />
        </div>
      </div>
    </Background>
  );
}
