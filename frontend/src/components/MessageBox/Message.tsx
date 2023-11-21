import { useMemo } from 'react';

import CustomButton from '@components/CustomButton';

interface MessageProps {
  type: 'left' | 'right';
  message: string;
  profile: string;
  feedback?: boolean;
}

function Message({ type, message, profile, feedback }: MessageProps) {
  const chatStyle = useMemo(
    () => ({
      box: type == 'left' ? 'chat-start' : 'chat-end',
      bubble: type == 'left' ? 'surface-content text-default' : 'surface-point-alt',
    }),
    [type],
  );

  return (
    <>
      <div className={`chat ${chatStyle.box}`}>
        <div className="chat-image avatar">
          <div className="w-60 rounded-full">
            <img
              alt="프로필 이미지"
              src={profile}
            />
          </div>
        </div>
        <div className={`chat-bubble max-w-none shadow-chat ${chatStyle.bubble}`}>
          {message}
          {feedback && (
            <div className="p-8">
              <CustomButton
                size="m"
                color="active"
                handleButtonClicked={() => alert('피드백')}
              >
                피드백하기
              </CustomButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
