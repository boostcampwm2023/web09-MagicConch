import { useEffect, useRef } from 'react';

import { IconButton } from '@components/Buttons';

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

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        inputRef.current?.focus();
      }
    });
    observer.observe(inputRef.current!);
  }, []);

  useEffect(() => {
    if (disabled) {
      return;
    }
    inputRef.current?.focus();
  }, [disabled]);

  return (
    <div className={`form-control flex flex-row w-[102%]`}>
      <input
        ref={inputRef}
        onKeyUp={detectEnter}
        disabled={disabled}
        type="text"
        placeholder="Type Here"
        className="input input-bordered w-full display-medium16 sm:text-14"
        maxLength={1000}
      />
      <IconButton
        icon="ion:send"
        buttonColor="transparent"
        onClick={submitMessage}
      />
    </div>
  );
}

export default ChatInput;
