import { IconButton } from '@components/common/Buttons';

export function NewChatLogButton() {
  return (
    <div className="w-200">
      <IconButton
        icon="ic:round-plus"
        buttonColor="transparent"
        size="s"
      >
        새로운 타로점 보기
      </IconButton>
    </div>
  );
}
