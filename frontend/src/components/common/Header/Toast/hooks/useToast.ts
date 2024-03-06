import { useEffect } from 'react';

import { useSideBarStore, useToastStore } from '@stores/zustandStores';

export function useToast() {
  const { message, removeToast } = useToastStore(state => ({
    message: state.message,
    removeToast: state.removeToast,
  }));

  const { sideBarState } = useSideBarStore(state => ({
    sideBarState: state.sideBarState,
  }));

  useEffect(() => {
    if (!message) return;
    removeToast();
  }, []);

  useEffect(() => {
    if (!message) return;

    if (sideBarState) {
      removeToast();
    }

    if (message) {
      const timeout = setTimeout(() => {
        removeToast();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return { message, removeToast };
}
