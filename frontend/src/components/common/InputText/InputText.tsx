interface InputTextProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputText = ({ onChange }: InputTextProps) => {
  return (
    <input
      onChange={onChange}
      className="input input-bordered input-sm"
      type="text"
      placeholder="닉네임을 입력하세요."
    />
  );
};
