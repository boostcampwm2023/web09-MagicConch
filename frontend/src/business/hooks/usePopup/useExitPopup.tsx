import useOverlay from '../useOverlay';

import Popup from '@components/Popup';

interface openExitPopupParams {
  onConfirm: ({ closeOverlay }: CloseOverlayFunc) => void;
  onCancel?: () => void;
}

export function useExitPopup() {
  const { openOverlay } = useOverlay();

  const openExitPopup = ({ onConfirm, onCancel }: openExitPopupParams) => {
    openOverlay(({ closeOverlay }) => (
      <Popup
        closePopup={closeOverlay}
        onConfirm={() => onConfirm({ closeOverlay })}
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
