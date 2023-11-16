import { OverlayControlRef, OverlayController } from './OverlayController';
import { OverlayContext } from './OverlayProvider';
import { CreateOverlayElement } from './types';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

interface OverlayOptions {
  exitOnUnmount?: boolean;
}

// overlay element를 구분하기 위한 id
let elementId = 1;

export default function useOverlay({ exitOnUnmount = false }: OverlayOptions = {}) {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('OverlayProvider를 찾을 수 없습니다.');
  }

  const { mount, unmount } = context;
  const [id] = useState(() => String(elementId++));

  const overlayRef = useRef<OverlayControlRef | null>(null);

  useEffect(() => {
    return () => {
      if (exitOnUnmount) {
        overlayRef.current?.close();
      }
    };
  }, []);

  return useMemo(
    () => ({
      open: (ovelayElement: CreateOverlayElement) => {
        mount(
          id,
          <OverlayController
            // overlay를 열 때마다 새로운 key를 부여하여 새로운 element를 생성하도록 함
            // 그러지 않으면 overlay가 열린 상태에서 닫고, 다시 열었을 때 overlay가 열리지 않음
            // 이유는 key가 같으면 react가 같은 element로 판단하여 업데이트를 하지 않기 때문
            key={new Date().toString()}
            ref={overlayRef}
            overlayElement={ovelayElement}
            onExit={() => unmount(id)}
          />,
        );
      },
      close: () => {
        console.log('close', id);
        overlayRef.current?.close();
      },
      exit: () => {
        console.log('unmount');
        unmount(id);
      },
    }),
    [],
  );
}
