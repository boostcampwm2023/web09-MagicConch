import { useOverlay } from '../overlay';

import { LoginPopup } from '@components/common';

import { getAuthorizedQuery } from '@stores/queries';

interface UseLoginPopupParams {
  moveAiChat: () => void;
}

export function useLoginPopup({ moveAiChat }: UseLoginPopupParams) {
  const { openOverlay } = useOverlay();
  const { data } = getAuthorizedQuery();

  const openLoginPopup = () => {
    if (data?.isAuthenticated) {
      moveAiChat();
      return;
    }
    openOverlay(({ closeOverlay }) => (
      <LoginPopup
        moveAiChat={moveAiChat}
        closePopup={closeOverlay}
      ></LoginPopup>
    ));
  };

  return { openLoginPopup };
}
