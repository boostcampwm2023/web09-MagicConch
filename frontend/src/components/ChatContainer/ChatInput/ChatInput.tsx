import { useRef } from 'react';

import { CustomButton } from '@components/Buttons';

import { Icon } from '@iconify/react';

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
        className="input input-bordered input-md w-full display-medium16 sm:text-14"
      />
      <CustomButton
        color="transparent"
        circle
        onClick={submitMessage}
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
