import { useCallback, useEffect, useState } from 'react';
import { Location, useBlocker as reactRouterUserBlocker } from 'react-router-dom';

import { useExitPopup } from './usePopup/useExitPopup';

type useBlockerParams = {
  when: (args: { currentLocation: Location<any>; nextLocation: Location<any> }) => boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function useBlocker({ when, onConfirm, onCancel }: useBlockerParams) {
  const [blockedGoBack, setBlockedGoBack] = useState<boolean>(true);
  const [afterRunCallbacks, setAfterRunCallbacks] = useState<(() => void)[]>([]);

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
      afterRunCallbacks.forEach(callback => {
        callback();
      });
      setAfterRunCallbacks([]);
    }
  }, [blockedGoBack]);

  const blockGoBack = useCallback(() => {
    setBlockedGoBack(true);
  }, []);

  const unblockGoBack = useCallback((afterRunCallback: () => void) => {
    setBlockedGoBack(false);
    setAfterRunCallbacks(prev => [...prev, afterRunCallback]);
  }, []);

  return { blockedGoBack, blockGoBack, unblockGoBack };
}
