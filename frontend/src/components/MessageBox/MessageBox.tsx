import { Icon } from '@iconify/react/dist/iconify.js';

import CustomButton from '@components/CustomButton';
import Message from '@components/MessageBox/Message';

interface MessageBoxProps {
  tarotId?: string;
  type: 'left' | 'right';
  message: string;
}

// TODO: tarotId로 서버에서 타로 카드 이미지 정보를 받아와서 src와 alt 채워주기
// TODO: 조건식 !tarotID -> tarotId로 변경
// TODO: 프로필 이미지 설정

const MessageBox = ({ tarotId, type, message }: MessageBoxProps) => {
  return (
    <div className="relative">
      {!tarotId && type == 'left' && (
        <img
          className="w-120 h-200 relative left-72"
          src="/ddung.png"
          alt="테스트용 이미지"
        />
      )}
      <div className="flex">
        <Message
          type={type}
          message={message}
          profile="/moon.png"
        />
        {!tarotId && type == 'left' && (
          <div className="relative right-50 top-105">
            <CustomButton
              color="transparent"
              size="s"
            >
              <Icon
                icon="ion:share"
                className="text-white text-28"
              />
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
