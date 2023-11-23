import { Link } from 'react-router-dom';

import { CustomButton, IconButton } from '@components/Buttons';
import { MessageButton } from '@components/ChatList';
import Message from '@components/MessageBox/Message';

interface MessageBoxProps {
  tarotId?: string;
  type: 'left' | 'right';
  message: string;
  profile: string;
  button?: MessageButton;
  shareLinkId?: string;
}

// TODO: tarotId로 서버에서 타로 카드 이미지 정보를 받아와서 src와 alt 채워주기
// TODO: 프로필 이미지 설정

function MessageBox({ tarotId, type, message, profile, button, shareLinkId }: MessageBoxProps) {
  return (
    <div className="relative max-w-[70%]">
      {tarotId && (
        <img
          className="w-120 h-200 relative left-72 rounded-lg"
          src={`../../../__tests__/mocks/cards/${tarotId}.jpg`}
          alt="테스트용 이미지"
        />
      )}
      <div className="flex">
        <Message
          type={type}
          message={message}
          profile={profile}
        />
        {shareLinkId && (
          <div className="absolute bottom-10 -right-50">
            <Link
              to={`/result/${shareLinkId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton
                buttonColor="transparent"
                iconColor="textWhite"
                icon="ion:share"
                iconSize={28}
                circle
              />
            </Link>
          </div>
        )}
        {button && (
          <div className="absolute bottom-15 -right-90">
            <CustomButton
              size="s"
              color="active"
              onClick={button.onClick}
            >
              {button.content}
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBox;
