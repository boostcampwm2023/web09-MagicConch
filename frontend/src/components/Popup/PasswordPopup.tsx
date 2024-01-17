import { useRef } from 'react';

import Popup from './Popup';

interface PasswordPopupProps {
  close: () => void;
  onCancel?: () => void;
  defaultValue?: string;
  onSubmit: (password: string) => void;
}

export default function PasswordPopup({ close, onCancel, defaultValue, onSubmit }: PasswordPopupProps) {
  const passwordInput = useRef<HTMLInputElement>(null);

  const passwordSubmit = () => {
    const password = passwordInput.current?.value;
    if (password) {
      onSubmit(password || '');
    }
  };

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    passwordSubmit();
  };

  return (
    <Popup
      close={close}
      onCancel={onCancel}
      onConfirm={passwordSubmit}
    >
      <form
        className="flex-with-center flex-col gap-16"
        onSubmit={formSubmit}
      >
        <div>비밀번호를 {defaultValue ? '설정' : '입력'}하세요</div>
        <input
          ref={passwordInput}
          type="text"
          className="input input-bordered input-sm"
          defaultValue={defaultValue}
        />
      </form>
    </Popup>
  );
}
