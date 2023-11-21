import { Link } from 'react-router-dom';

import { MessageButton } from '@components/ChatList';
import IconButton from '@components/IconButton';
import Message from '@components/MessageBox/Message';

interface MessageBoxProps {
  tarotId?: string;
  type: 'left' | 'right';
  message: string;
  profile: string;
  button?: MessageButton;
}

// TODO: tarotId로 서버에서 타로 카드 이미지 정보를 받아와서 src와 alt 채워주기
// TODO: 조건식 !tarotId -> tarotId로 변경
// TODO: 프로필 이미지 설정

function MessageBox({ tarotId, type, message, profile, button }: MessageBoxProps) {
  const recievedResult = tarotId && type == 'left';

  // TODO: 공유하기 페이지 아이디를 서버에서 받아와야함.
  const resultSharePageId = '1';

  return (
    <div className="relative max-w-[70%]">
      {recievedResult && (
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
          button={button}
        />
        {recievedResult && (
          <div className="absolute bottom-10 -right-50">
            <Link
              to={`/result/${resultSharePageId}`}
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
      </div>
    </div>
  );
}

export default MessageBox;
