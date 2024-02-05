import { useOverlay } from '../overlay';

import { PasswordPopup } from '@components/common/Popup';
import type { InitSocketEvents } from '@components/common/Popup';

import { randomString } from '@utils/random';

type openPasswordPopupParams = {
  host?: boolean;
  onSubmit?: ({ password, closePopup }: { password: string } & ClosePopupFunc) => void;
  onCancel?: () => void;
  initSocketEvents?: InitSocketEvents;
};

export function usePasswordPopup() {
  const { openOverlay } = useOverlay();

  const openPasswordPopup = ({ host, onSubmit, onCancel, initSocketEvents }: openPasswordPopupParams) => {
    const defaultValue = host ? randomString() : '';

    openOverlay(({ closeOverlay: closePopup }) => (
      <PasswordPopup
        closePopup={closePopup}
        onCancel={onCancel}
        onSubmit={password => {
          onSubmit?.({ password, closePopup });
        }}
        defaultValue={defaultValue}
        initSocketEvents={initSocketEvents}
      />
    ));
  };

  return { openPasswordPopup };
}
