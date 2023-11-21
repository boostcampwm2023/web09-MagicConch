import CustomButton from '@components/CustomButton';
import Message from '@components/MessageBox/Message';

import { Icon } from '@iconify/react/dist/iconify.js';

interface MessageBoxProps {
  tarotId?: string;
  type: 'left' | 'right';
  message: string;
  profile: string;
  feedback?: boolean;
}

// TODO: tarotId로 서버에서 타로 카드 이미지 정보를 받아와서 src와 alt 채워주기
// TODO: 조건식 !tarotId -> tarotId로 변경
// TODO: 프로필 이미지 설정

function MessageBox({ tarotId, type, message, profile, feedback }: MessageBoxProps) {
  const recievedResult = tarotId && type == 'left';

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
          feedback={feedback}
        />
        {recievedResult && (
          <div className="absolute bottom-10 -right-50">
            <CustomButton
              color="transparent"
              circle
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
}

export default MessageBox;
