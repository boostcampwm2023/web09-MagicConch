import { useEffect } from 'react';

import { useToastStore } from '@stores/zustandStores';

export function useToast() {
  const { message, removeToast } = useToastStore(state => ({
    message: state.message,
    removeToast: state.removeToast,
  }));

  useEffect(removeToast, []);

  useEffect(() => {
    if (!message) return;

    if (message) {
      const timeout = setTimeout(() => {
        removeToast();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return { message };
}
