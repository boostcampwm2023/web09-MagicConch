import { PasswordPopup } from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { randomString } from '@utils/ramdom';

export default function usePasswordPopup() {
  const { open } = useOverlay();

  type PasswordPopupOptions = {
    host?: boolean;
  };
  const defaultOptions: PasswordPopupOptions = {
    host: false,
  };

  const openPasswordPopup = (setPassword: (password: string) => void, options = defaultOptions) => {
    const defaultValue = options.host ? randomString() : '';
    open(({ close }) => (
      <PasswordPopup
        close={close}
        onSubmit={setPassword}
        defaultValue={defaultValue}
      />
    ));
  };

  return { openPasswordPopup };
}
