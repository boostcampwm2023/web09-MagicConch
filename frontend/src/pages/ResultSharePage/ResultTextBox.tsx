import { useOverflowTextBoxCenter } from '@business/hooks/useOverflowTextBoxCenter';

interface ResultTextBoxProps {
  content: string;
}

export function ResultTextBox({ content }: ResultTextBoxProps) {
  const { textBoxRef } = useOverflowTextBoxCenter();
  return (
    <div
      ref={textBoxRef}
      className="w-full flex-1 flex justify-center rounded-2xl items-center overflow-auto border-t-50 border-transparent px-70"
    >
      {content}
    </div>
  );
}
