import LoginPopup from '@components/Popup/LoginPopup';

import useOverlay from '@business/hooks/useOverlay';

interface UseLoginPopupParams {
  moveAiChat: () => void;
}

export function useLoginPopup({ moveAiChat }: UseLoginPopupParams) {
  const { openOverlay } = useOverlay();

  const openLoginPopup = () => {
    openOverlay(() => <LoginPopup moveAiChat={moveAiChat}></LoginPopup>);
  };

  return { openLoginPopup };
}
