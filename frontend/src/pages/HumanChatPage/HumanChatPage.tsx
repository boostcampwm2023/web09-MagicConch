import { useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Background from '@components/Background';
import CustomSelect from '@components/CustomSelect';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useWebRTC } from '@business/hooks/useWebRTC';

export type OutletContext = ReturnType<typeof useWebRTC>;

export default function HumanChatPage() {
  const { roomName } = useParams();
  const webRTCData = useWebRTC(roomName as string);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar key="chat-side-bar">
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
      <Outlet context={webRTCData} />
    </Background>
  );
}
