import { Message } from '.';
import type { Message as MessageType } from '..';
import { Link } from 'react-router-dom';

import { Button, IconButton } from '@components/common/Buttons';

import { getTarotImageQuery } from '@stores/queries/getTarotImageQuery';

interface MessageBoxProps extends MessageType {}

// TODO: 프로필 이미지 설정

export function MessageBox({ tarotId, type, message, profile, button, shareLinkId }: MessageBoxProps) {
  const cardUrl = tarotId ? getTarotImageQuery(tarotId).data.cardUrl : '';

  return (
    <div className="relative w-h-full">
      <div className={`relative ${type === 'left' ? 'left-75' : 'right-75'}`}>
        {tarotId && (
          <img
            className="w-120 h-200 min-w-120 rounded-lg"
            src={cardUrl}
            alt="테스트용 이미지" // TODO server에서 카드 이름도 같이 넘겨주면 alt에 채워주기
          />
        )}
      </div>

      {message && (
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
                  icon="ion:share"
                  buttonColor="transparent"
                />
              </Link>
            </div>
          )}
          {button && (
            <div className="relative left-70">
              <Button
                size="s"
                onClick={button.onClick}
              >
                {button.content}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
