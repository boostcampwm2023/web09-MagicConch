import { OverlayContext } from './OverlayProvider';
import { CreateOverlayElement } from './types';
import { useContext, useEffect, useMemo, useState } from 'react';

// overlay element를 구분하기 위한 id
let elementId = 1;

export default function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('OverlayProvider를 찾을 수 없습니다.');
  }

  const [id] = useState(() => String(elementId++));
  const [opened, setOpened] = useState(true);

  const { mount, unmount } = context;

  useEffect(() => {
    return () => {
      unmount(id);
    };
  }, [id, unmount]);

  return useMemo(
    () => ({
      open: (OvelayElement: CreateOverlayElement) => {
        mount(
          id,
          <OvelayElement
            key={String(new Date())}
            opened={opened}
            close={() => unmount(id)}
          />,
        );
      },
      close: () => {
        unmount(id);
      },
    }),
    [id, mount, unmount],
  );
}
