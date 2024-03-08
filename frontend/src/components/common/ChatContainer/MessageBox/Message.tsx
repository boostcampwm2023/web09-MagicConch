import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { IconButton } from '@components/common';

interface MessageProps {
  type: 'left' | 'right';
  message: string;
  profile: string;
  shareLinkId?: string;
}

export function Message({ type, message, profile, shareLinkId }: MessageProps) {
  const chatStyle = useMemo(
    () => ({
      box: type == 'left' ? 'chat-start' : 'chat-end',
      bubble: type == 'left' ? 'surface-content text-default' : 'surface-point-alt',
    }),
    [type],
  );

  return (
    <>
      <div className={`chat ${chatStyle.box} relative`}>
        <div className="chat-image avatar">
          <div className="w-60 rounded-full">
            <img
              alt="프로필 이미지"
              src={profile}
            />
          </div>
        </div>
        <div className={`w-full flex ${type === 'left' ? 'justify-start' : 'justify-end'} items-end`}>
          <div
            className={`chat-bubble max-w[70%] sm:max-w-[85%] shadow-white ${chatStyle.bubble} ${
              type == 'right' && 'text-white-alt'
            }`}
          >
            {message.length ? message : <span className="loading loading-dots loading-md"></span>}
          </div>
          {shareLinkId && (
            <Link
              className="block right-0 bottom-0"
              to={`/result/${shareLinkId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton
                icon="ion:share"
                buttonColor="transparent"
              />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
