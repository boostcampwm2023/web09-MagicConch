import TOLD from '@business/services/TOLD';

import { useOverlay } from './overlay';

interface UserFeedbackPrams {
  type: 'AI' | 'HUMAN';
}

export function useUserFeedback({ type }: UserFeedbackPrams) {
  const { openOverlay } = useOverlay();

  const displayForm = () => {
    TOLD.displayForm(type);

    openOverlay(({ closeOverlay }) => {
      const interval = setInterval(() => {
        if (TOLD.isFormVisible()) {
          closeOverlay();
          clearInterval(interval);
        }
      }, 1000);

      return (
        <div className="w-h-screen flex-with-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    });
  };

  return { displayForm };
}
