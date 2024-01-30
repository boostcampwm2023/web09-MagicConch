import { PasswordPopup } from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { randomString } from '@utils/ramdom';

type openPasswordPopupParams = {
  host?: boolean;
  onSubmit?: ({ password, closePopup }: { password: string; closePopup: () => void }) => void;
  onCancel?: () => void;
};

export function usePasswordPopup() {
  const { open } = useOverlay();

  const openPasswordPopup = ({ host, onSubmit, onCancel }: openPasswordPopupParams) => {
    const defaultValue = host ? randomString() : '';

    open(({ close: closePopup }) => (
      <PasswordPopup
        close={closePopup}
        onCancel={onCancel}
        onSubmit={password => {
          onSubmit?.({ password, closePopup });
        }}
        defaultValue={defaultValue}
      />
    ));
  };

  return { openPasswordPopup };
}
