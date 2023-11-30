import { PasswordPopup } from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { randomString } from '@utils/ramdom';

export default function usePasswordPopup() {
  const { open } = useOverlay();

  const openPasswordPopup = ({
    host,
    onSubmit,
    onClose,
  }: {
    host?: boolean;
    onSubmit?: ({ password, close }: { password: string; close: () => void }) => void;
    onClose?: () => void;
  }) => {
    const defaultValue = host ? randomString() : '';

    open(({ close }) => (
      <PasswordPopup
        close={() => {
          close();
          onClose?.();
        }}
        onSubmit={password => {
          onSubmit?.({ password, close });
        }}
        defaultValue={defaultValue}
      />
    ));
  };

  return { openPasswordPopup };
}
