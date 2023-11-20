import CustomButton from '../CustomButton';
import { Icon } from '@iconify/react';
import { useRef } from 'react';

interface ChatInputProps {
  disabled: boolean;
  sendChatMessage: (message: string) => void;
}

function ChatInput({ disabled, sendChatMessage }: ChatInputProps) {
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
    <div className={`form-control flex flex-row w-full`}>
      <input
        ref={inputRef}
        onKeyUp={detectEnter}
        disabled={disabled}
        type="text"
        placeholder="Type Here"
        className="input input-bordered input-md w-full display-medium16"
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
