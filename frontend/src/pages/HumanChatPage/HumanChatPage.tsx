import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useBlocker } from '@business/hooks/useBlocker';
import { useHumanChatMessage } from '@business/hooks/useChatMessage';
import { useHumanTarotSpread } from '@business/hooks/useTarotSpread';
import useWebRTC from '@business/hooks/useWebRTC';

import { useHumanChatPageContentAnimation } from './useHumanChatPageContentAnimation';
import { ChatPageState, useHumanChatPageCreateRoomEvent } from './useHumanChatPageCreateRoomEvent';
import { useHumanChatPageSideBar } from './useHumanChatPageSIdeBar';
import { useHumanChatPageWrongURL } from './useHumanChatPageWrongURL';

export interface OutletContext {
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
  chatPageState: ChatPageState;
  setChatPageState: Dispatch<SetStateAction<ChatPageState>>;
  disableSideBar: () => void;
  enableSideBar: () => void;
  unblockGoBack: () => void;
}

export default function HumanChatPage() {
  useHumanChatPageWrongURL();

  const navigate = useNavigate();
  const { endWebRTC } = useWebRTC();

  const { chatPageState, setChatPageState } = useHumanChatPageCreateRoomEvent();

  const { messages, onSubmitMessage, inputDisabled, addPickCardMessage } = useHumanChatMessage();
  const { tarotButtonClick, tarotButtonDisabled } = useHumanTarotSpread(addPickCardMessage);

  const { changeContentAnimation, contentAnimation } = useHumanChatPageContentAnimation();
  const { disableSideBar, enableSideBar, sideBarDisabled } = useHumanChatPageSideBar({
    onDisableSideBar: () => {
      changeContentAnimation(false);
    },
  });

  const { unblockGoBack } = useBlocker({
    when: ({ nextLocation }) => nextLocation.pathname === '/' || nextLocation.pathname === '/chat/human',
    onConfirm: () => navigate('/'),
  });

  useEffect(() => {
    return () => {
      endWebRTC();
    };
  }, []);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar
            key="chat-side-bar"
            onSide={changeContentAnimation}
            icon={{ open: 'mdi:message-off', close: 'mdi:message' }}
            disabled={sideBarDisabled}
          >
            <ChatContainer
              width="w-[90%]"
              height="h-[80%]"
              position="top-[5vh]"
              messages={messages}
              onSubmitMessage={onSubmitMessage}
              inputDisabled={inputDisabled}
            />
          </SideBar>,
        ]}
      />
      <div className="w-h-screen">
        <div className={`flex-with-center h-full ${contentAnimation}`}>
          <Outlet
            context={{
              tarotButtonClick,
              tarotButtonDisabled,
              chatPageState,
              setChatPageState,
              disableSideBar,
              enableSideBar,
              unblockGoBack,
            }}
          />
        </div>
      </div>
    </Background>
  );
}
