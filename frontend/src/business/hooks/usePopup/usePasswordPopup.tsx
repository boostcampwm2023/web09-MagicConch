import { PasswordPopup } from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { randomString } from '@utils/ramdom';

type openPasswordPopupParams = {
  host?: boolean;
  onSubmit?: ({ password, closeOverlay }: { password: string } & CloseOverlayFunc) => void;
  onCancel?: () => void;
};

export function usePasswordPopup() {
  const { openOverlay } = useOverlay();

  const openPasswordPopup = ({ host, onSubmit, onCancel }: openPasswordPopupParams) => {
    const defaultValue = host ? randomString() : '';

    openOverlay(({ closeOverlay }) => (
      <PasswordPopup
        closePopup={closeOverlay}
        onCancel={onCancel}
        onSubmit={password => {
          onSubmit?.({ password, closeOverlay });
        }}
        defaultValue={defaultValue}
      />
    ));
  };

  return { openPasswordPopup };
}
