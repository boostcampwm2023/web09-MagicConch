import { IconButton } from '@components/common/Buttons';

import { useAiChatLogId } from '@stores/zustandStores';

export function ContinueChatButton() {
  const { id, removeId } = useAiChatLogId();

  if (!id) return null;

  const handleClick = () => {
    removeId();
  };

  return (
    <div className="w-200">
      <IconButton
        icon="carbon:continue"
        buttonColor="transparent"
        size="s"
        onClick={handleClick}
      >
        타로 상담 이어하기
      </IconButton>
    </div>
  );
}
