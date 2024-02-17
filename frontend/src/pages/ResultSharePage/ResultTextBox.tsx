import { useOverflowTextBoxCenter } from '@business/hooks';

interface ResultTextBoxProps {
  content: string;
}

export function ResultTextBox({ content }: ResultTextBoxProps) {
  const { textBoxRef } = useOverflowTextBoxCenter();
  return (
    <div
      ref={textBoxRef}
      className="w-full flex-1 flex justify-center rounded-2xl items-center overflow-auto border-t-40 md:border-b-40 border-transparent px-60 sm:px-20 sm:text-12"
    >
      {content}
    </div>
  );
}
