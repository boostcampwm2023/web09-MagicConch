import { useContext, useEffect, useMemo, useState } from 'react';

import { OverlayContext } from './OverlayProvider';
import { CreateOverlayElement } from './types';

// overlay element를 구분하기 위한 id
let elementId = 1;

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('OverlayProvider를 찾을 수 없습니다.');
  }

  const [id] = useState(() => String(elementId++));
  const [opened] = useState(true);

  const { mount, unmount } = context;

  useEffect(() => {
    return () => {
      unmount(id);
    };
  }, [id, unmount]);

  return useMemo(
    () => ({
      openOverlay: (OverlayElement: CreateOverlayElement) => {
        mount(
          id,
          <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-10">
            <OverlayElement
              key={String(new Date())}
              opened={opened}
              closeOverlay={() => unmount(id)}
            />
          </div>,
        );
      },
      closeOverlay: () => {
        unmount(id);
      },
    }),
    [id, mount, unmount],
  );
}
