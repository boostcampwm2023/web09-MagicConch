import LoginPopup from '@components/Popup/LoginPopup';

import useOverlay from '@business/hooks/useOverlay';

interface UseLoginPopupParams {
  moveAiChat: () => void;
}

export function useLoginPopup({ moveAiChat }: UseLoginPopupParams) {
  const { open } = useOverlay();

  const openLoginPopup = () => {
    open(() => <LoginPopup moveAiChat={moveAiChat}></LoginPopup>);
  };

  return { openLoginPopup };
}
