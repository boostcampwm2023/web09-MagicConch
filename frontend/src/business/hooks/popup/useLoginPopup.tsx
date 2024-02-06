import { useOverlay } from '../overlay';

import { LoginPopup } from '@components/common';

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
