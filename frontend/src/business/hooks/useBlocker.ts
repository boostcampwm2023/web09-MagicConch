import { useCallback, useEffect, useState } from 'react';
import { Location, useBlocker as reactRouterUserBlocker, useNavigate } from 'react-router-dom';

import { useExitPopup } from './usePopup/useExitPopup';

type useBlockerParams = {
  when: (args: { currentLocation: Location<any>; nextLocation: Location<any> }) => boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function useBlocker({ when, onConfirm, onCancel }: useBlockerParams) {
  const [blockedGoBack, setBlockedGoBack] = useState<boolean>(true);

  const navigate = useNavigate();

  const { openExitPopup } = useExitPopup();

  reactRouterUserBlocker(args => {
    if (!blockedGoBack) {
      return false;
    }

    if (when({ ...args })) {
      openExitPopup({
        onConfirm: () => {
          setBlockedGoBack(false);
          onConfirm?.();
        },
        onCancel: ({ close }) => {
          onCancel?.();
          close();
        },
      });
      return true;
    }

    return false;
  });

  useEffect(() => {
    if (!blockedGoBack) {
      navigate('/');
    }
  }, [blockedGoBack]);

  const blockGoBack = useCallback(() => {
    setBlockedGoBack(true);
  }, []);

  const unblockGoBack = useCallback(() => {
    setBlockedGoBack(false);
  }, []);

  return { blockedGoBack, blockGoBack, unblockGoBack };
}
