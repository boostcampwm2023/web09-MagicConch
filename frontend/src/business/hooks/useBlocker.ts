import { useCallback, useEffect, useState } from 'react';
import { Location, unstable_useBlocker, useNavigate } from 'react-router-dom';

import { useExitPopup } from './useHumanChat/useExitPopup';

export function useBlocker({
  when,
  onConfirm,
  onCancel,
}: {
  when: (args: { currentLocation: Location<any>; nextLocation: Location<any> }) => boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  const [blockedGoBack, setBlockedGoBack] = useState<boolean>(true);

  const navigate = useNavigate();

  const { openExitPopup } = useExitPopup();

  unstable_useBlocker(args => {
    if (!blockedGoBack) {
      return false;
    }

    if (when({ ...args })) {
      openExitPopup({
        onConfirm: () => {
          setBlockedGoBack(false);
          onConfirm?.();
        },
        onCancel: () => {
          onCancel?.();
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
