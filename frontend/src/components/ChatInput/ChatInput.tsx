import { Icon } from '@iconify/react';
import { useRef } from 'react';

import CustomButton from '../CustomButton';

interface ChatInputProps {
  size?: string;
  disabled: boolean;
  sendChatMessage: (message: string) => void;
}

function ChatInput({ size = '760', disabled, sendChatMessage }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const submitMessage = () => {
    const input = inputRef.current;
    if (input?.value) {
      sendChatMessage(input.value);
      input.value = '';
    }
  };

  const detectEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitMessage();
  };

  return (
    <div className={`form-control absolute bottom-15 flex flex-row w-${size}`}>
      <input
        ref={inputRef}
        onKeyUp={detectEnter}
        disabled={disabled}
        type="text"
        placeholder="Type here"
        className="input input-bordered input-md w-full"
      />
      <CustomButton
        color="transparent"
        size="s"
        handleButtonClicked={submitMessage}
      >
        <Icon
          icon="ion:send"
          className="text-white text-28"
        />
      </CustomButton>
    </div>
  );
}

export default ChatInput;
