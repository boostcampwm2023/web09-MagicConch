import { Link } from 'react-router-dom';

import { CustomButton, IconButton } from '@components/Buttons';
import type { Message as MessageType } from '@components/ChatContainer';

import { getTarotImageQuery } from '@stores/queries/getTarotImageQuery';

import Message from './Message';

interface MessageBoxProps extends MessageType {}

// TODO: 프로필 이미지 설정

function MessageBox({ tarotId, type, message, profile, button, shareLinkId }: MessageBoxProps) {
  const cardUrl = tarotId ? getTarotImageQuery(tarotId).data.cardUrl : '';

  return (
    <div className="relative max-w-[70%]">
      {tarotId && (
        <img
          className="w-120 h-200 relative left-72 rounded-lg"
          src={cardUrl}
          alt="테스트용 이미지" // TODO server에서 카드 이름도 같이 넘겨주면 alt에 채워주기
        />
      )}
      {message && (
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
            <div
              id="TOLD"
              className="absolute bottom-15 -right-90"
            >
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
      )}
    </div>
  );
}

export default MessageBox;
