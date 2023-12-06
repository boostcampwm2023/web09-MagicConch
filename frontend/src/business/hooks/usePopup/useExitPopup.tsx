import useOverlay from '../useOverlay';

import Popup from '@components/Popup';

interface openExitPopupParams {
  onConfirm: ({ close }: CloseFunc) => void;
  onCancel?: ({ close }: CloseFunc) => void;
}

export function useExitPopup() {
  const { open } = useOverlay();

  const openExitPopup = ({ onConfirm, onCancel }: openExitPopupParams) => {
    open(({ close }) => (
      <Popup
        onConfirm={() => onConfirm({ close })}
        onCancel={() => onCancel?.({ close })}
      >
        <div className="flex-with-center flex-col gap-16">
          <div>나갈거야?</div>
        </div>
      </Popup>
    ));
  };

  return { openExitPopup };
}
