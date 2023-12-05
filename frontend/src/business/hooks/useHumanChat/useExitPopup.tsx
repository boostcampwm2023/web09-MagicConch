import useOverlay from '../useOverlay';

import Popup from '@components/Popup';

interface ExitPopupProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

export function useExitPopup() {
  const { open } = useOverlay();

  const openExitPopup = ({ onConfirm, onCancel }: ExitPopupProps) => {
    open(({ close }) => (
      <Popup
        close={close}
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        <div className="flex-with-center flex-col gap-16">
          <div>나갈거야?</div>
        </div>
      </Popup>
    ));
  };

  return { openExitPopup };
}
