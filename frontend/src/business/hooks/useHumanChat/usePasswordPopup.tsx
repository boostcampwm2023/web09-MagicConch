import { PasswordPopup } from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { randomString } from '@utils/ramdom';

type PasswordPopupOptions = {
  host?: boolean;
};

export default function usePasswordPopup() {
  const { open } = useOverlay();

  const defaultOptions = false;

  const openPasswordPopup = ({ host = defaultOptions }: { host: boolean }) => {
    const defaultValue = host ? randomString() : '';

    return new Promise<string>(resolve =>
      open(({ close }) => (
        <PasswordPopup
          close={() => {
            close();
            resolve('');
          }}
          onSubmit={password => {
            close();
            resolve(password);
          }}
          defaultValue={defaultValue}
        />
      )),
    );
  };

  return { openPasswordPopup };
}
