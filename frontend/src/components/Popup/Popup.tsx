import { CustomButton } from '@components/Buttons';

interface PopupProps {
  opened: boolean;
  close: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
}

export default function Popup({ onCancel, onConfirm, children }: PopupProps) {
  return (
    <div className="w-[100vw] h-[100vh] flex-with-center">
      <div className="surface-content rounded p-16 gap-16">
        <div className="flex-with-center flex-row gap-16 p-16 display-bold16">{children}</div>
        <div className="flex justify-around p-12">
          <CustomButton
            size="m"
            color="dark"
            onClick={onCancel}
          >
            취소하기
          </CustomButton>
          <CustomButton
            size="m"
            color="active"
            onClick={onConfirm}
          >
            확인하기
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
