import { useState } from 'react';

export function useHumanChatPageContentAnimation() {
  const [contentAnimation, setContentAnimation] = useState<string>('');

  const changeContentAnimation = (opendSidebar: boolean) => {
    const newAnimation = opendSidebar
      ? 'animate-contentSideWithOpeningSidebar'
      : 'animate-contentSideWithClosingSidebar';

    setContentAnimation(newAnimation);
  };

  return { contentAnimation, changeContentAnimation };
}
