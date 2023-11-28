import { Link } from 'react-router-dom';

import { CustomButton, IconButton } from '@components/Buttons';
import { MessageButton } from '@components/ChatContainer/ChatList';
import Message from '@components/ChatContainer/MessageBox/Message';

import { getTarotImageQuery } from '@stores/queries/getTarotImageQuery';

interface MessageBoxProps {
  tarotId?: number;
  type: 'left' | 'right';
  message: string;
  profile: string;
  button?: MessageButton;
  shareLinkId?: string;
}

// TODO: 프로필 이미지 설정

function MessageBox({ tarotId, type, message, profile, button, shareLinkId }: MessageBoxProps) {
  const cardUrl = tarotId ? getTarotImageQuery(tarotId).data.cardUrl : '';

  return (
    <div className="relative max-w-[70%] sm:max-w-[90%]">
      <div className="relative left-70 w-[70%]">
        {tarotId && (
          <img
            className="w-120 h-200 rounded-lg"
            src={cardUrl}
            alt="테스트용 이미지" // TODO server에서 카드 이름도 같이 넘겨주면 alt에 채워주기
          />
        )}
      </div>

      <div className="flex flex-col">
        <Message
          type={type}
          message={message}
          profile={profile}
        />
        {shareLinkId && (
          <div className="absolute -right-50 bottom-5">
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
            className="relative left-70 w-80"
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
    </div>
  );
}

export default MessageBox;
