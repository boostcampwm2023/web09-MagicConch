import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { usePasswordPopup } from '@business/hooks/useHumanChat';
import { useSocket } from '@business/hooks/useSocket';
import { useWebRTC } from '@business/hooks/useWebRTC';

export type OutletContext = ReturnType<typeof useWebRTC>;

export default function HumanChatPage() {
  const { socketEmit, socketOn, connectSocket, disconnectSocket } = useSocket('WebRTC');
  const webRTCData = useWebRTC();

  const { roomName } = useParams();

  const { state } = useLocation();
  const navigate = useNavigate();

  const { openPasswordPopup } = usePasswordPopup();

  console.log('!');

  useEffect(() => {
    connectSocket(import.meta.env.VITE_HUMAN_SOCKET_URL);
    // 1.만약 roomName이 있고, host가 아니라면 다른곳에서 진입함.
    //  - password를 물어본다.
    //  - 서버와 통신해 현재 roomName의 비밀번호가 맞는지 확인한다.
    //  - 맞다면, joinRoom을 하고, navigate를 한다.
    //  - 틀리다면, 다시 password를 물어본다.

    // 2.만약 roomName이 있고, host가 맞다면
    //  - 알수없는 오류가 발생했다고 알람을 띄우고
    //  - /로 navigate를 한다.

    // 3.만약 roomName이 없고, host가 맞다면
    //  - password를 물어본다.
    //  - 서버와 통신해 password를 보내고, roomName을 받는다.
    //  - 받은 roomName으로 navigate를 한다.

    // 4.만약 roomName이 없고, host가 아니라면
    //  - 잘못된 경로로 들어왔고, 알람을 띄운다.
    //  - 그 후 /로 navigate를 한다.

    // 3.만약 roomName이 없고, host가 맞다면
    const createRoom = async () => {
      const password = await openPasswordPopup({ host: true });
      if (!password) {
        navigate('..');
        return;
      }

      socketEmit('createRoom', password);
      socketOn('roomCreated', (roomName: string) => {
        navigate(roomName);
        webRTCData.startWebRTC({ roomName });
      });
    };

    // 3.만약 roomName이 없고, host가 맞다면
    if (!roomName && state.host) {
      createRoom();
    }

    return () => {
      webRTCData.endWebRTC();
      disconnectSocket();
    };
  }, []);

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
