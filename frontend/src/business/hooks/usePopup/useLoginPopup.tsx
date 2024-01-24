import LoginPopup from '@components/Popup/LoginPopup';

import useOverlay from '@business/hooks/useOverlay';

export function useLoginPopup() {
  const { open } = useOverlay();

  const openLoginPopup = () => {
    open(() => <LoginPopup></LoginPopup>);
  };

  return { openLoginPopup };
}
