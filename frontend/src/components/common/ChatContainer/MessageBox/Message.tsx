import { useMemo } from 'react';

interface MessageProps {
  type: 'left' | 'right';
  message: string;
  profile: string;
}

export function Message({ type, message, profile }: MessageProps) {
  const chatStyle = useMemo(
    () => ({
      box: type == 'left' ? 'chat-start' : 'chat-end',
      bubble: type == 'left' ? 'surface-content text-default' : 'surface-point-alt',
    }),
    [type],
  );

  return (
    <>
      <div className={`chat ${chatStyle.box} `}>
        <div className="chat-image avatar">
          <div className="w-60 rounded-full">
            <img
              alt="프로필 이미지"
              src={profile}
            />
          </div>
        </div>
        <div
          className={`chat-bubble max-w[70%] sm:max-w-[85%] shadow-white ${chatStyle.bubble} ${
            type == 'right' && 'text-white-alt'
          }`}
        >
          {message.length ? message : <span className="loading loading-dots loading-md"></span>}
        </div>
      </div>
    </>
  );
}
