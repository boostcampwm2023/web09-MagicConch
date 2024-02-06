import { useSideBarStore } from '@stores/zustandStores';

import { animationNames } from '@constants/animation';

export function useSideBarAnimation() {
  const { first, sideBarState } = useSideBarStore();

  if (first) return { animation: 'mr-[-100%]' };

  if (sideBarState) return { animation: animationNames.SHOW_SIDEBAR };

  return { animation: animationNames.HIDE_SIDEBAR };
}
