import { Button } from '@components/Buttons';

interface PopupProps {
  close: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
}

export default function Popup({ onCancel, onConfirm, children }: PopupProps) {
  return (
    <div className="w-[100vw] h-[100vh] flex-with-center">
      <div className="surface-content rounded p-16 gap-16">
        <div className="flex-with-center p-16 display-bold16">{children}</div>
        <div className="flex justify-around p-12 gap-16">
          <Button
            size="m"
            color="dark"
            onClick={() => onCancel?.()}
          >
            취소하기
          </Button>
          <Button
            size="m"
            color="active"
            onClick={() => onConfirm?.()}
          >
            확인하기
          </Button>
        </div>
      </div>
    </div>
  );
}
