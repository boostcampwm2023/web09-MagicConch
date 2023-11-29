import { PasswordPopup } from '@components/Popup';

import useOverlay from '@business/hooks/useOverlay';

import { randomString } from '@utils/ramdom';

export default function usePasswordPopup() {
  const { open } = useOverlay();

  const defaultOptions = false;

  const openPasswordPopup = ({ host = defaultOptions }: { host: boolean }) => {
    const defaultValue = host ? randomString() : '';

    return new Promise<{ password?: string; close?: () => void }>(resolve =>
      open(({ close }) => (
        <PasswordPopup
          close={() => {
            close();
            resolve({});
          }}
          onSubmit={password => {
            resolve({ password, close });
          }}
          defaultValue={defaultValue}
        />
      )),
    );
  };

  return { openPasswordPopup };
}
