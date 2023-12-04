import { ChangeEvent, ReactElement, cloneElement, useRef } from 'react';

interface InputFileButtonProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  children: ReactElement;
}
export default function InputFileButton({ onChange, accept, children }: InputFileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const clonedChildren = cloneElement(
    children,
    {
      onClick: () => inputRef.current?.click(),
    },
    children.props.children,
  );

  return (
    <label>
      {clonedChildren}
      <input
        type="file"
        ref={inputRef}
        onChange={onChange}
        accept={accept}
        hidden
      />
    </label>
  );
}
