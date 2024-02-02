import { useEffect, useRef } from 'react';

import Popup from './Popup';

export type InitSocketEvents = ({ password, closePopup }: { password?: string } & ClosePopupFunc) => void;

interface PasswordPopupProps {
  closePopup: () => void;
  onCancel?: () => void;
  defaultValue?: string;
  onSubmit: (password: string) => void;
  initSocketEvents?: InitSocketEvents;
}

export default function PasswordPopup({
  closePopup,
  onCancel,
  defaultValue,
  onSubmit,
  initSocketEvents,
}: PasswordPopupProps) {
  const passwordInput = useRef<HTMLInputElement>(null);

  const passwordSubmit = () => {
    const password = passwordInput.current?.value;
    onSubmit(password ?? '');
  };

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    passwordSubmit();
  };

  useEffect(() => {
    initSocketEvents?.({ closePopup, password: passwordInput.current?.value ?? '' });
  }, []);

  return (
    <Popup
      closePopup={closePopup}
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
