import { PasswordPopup } from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { randomString } from '@utils/ramdom';

type PasswordPopupOptions = {
  host?: boolean;
};

export default function usePasswordPopup() {
  const { open } = useOverlay();

  const defaultOptions: PasswordPopupOptions = {
    host: false,
  };

  const openPasswordPopup = ({
    onSubmit,
    options = defaultOptions,
  }: {
    onSubmit: (password: string) => void;
    options: PasswordPopupOptions;
  }) => {
    const defaultValue = options.host ? randomString() : '';
    open(({ close }) => (
      <PasswordPopup
        close={close}
        onSubmit={onSubmit}
        defaultValue={defaultValue}
      />
    ));
  };

  return { openPasswordPopup };
}
