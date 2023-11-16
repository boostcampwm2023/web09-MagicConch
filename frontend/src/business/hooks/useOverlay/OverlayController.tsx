import { CreateOverlayElement } from './types';
import { Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

interface OverlayControllerProps {
  overlayElement: CreateOverlayElement;
  onExit: () => void;
}

export interface OverlayControlRef {
  close: () => void;
}

export const OverlayController = forwardRef(function OverlayController(
  { overlayElement: OverlayElement, onExit }: OverlayControllerProps,
  ref: Ref<OverlayControlRef>,
) {
  const [overlayOpened, setOverlayOpend] = useState(false);

  const closeOverlay = useCallback(() => {
    setOverlayOpend(false);
  }, []);

  // 상위에서 ref를 소유한 컴포넌트에서 close 함수를 호출할 수 있도록 함
  useImperativeHandle(ref, () => ({ close: closeOverlay }), [closeOverlay]);

  useEffect(() => {
    setOverlayOpend(true);
  }, []);

  return (
    <OverlayElement
      opened={overlayOpened}
      close={closeOverlay}
      exit={onExit}
    />
  );
});
