export interface OnChangeSelectFunction {
  value: string;
  label: string;
}

export interface CustomSelectOptions extends OnChangeSelectFunction {
  selected?: boolean;
}

interface CustomSelectProps {
  options: CustomSelectOptions[];
  required?: boolean;
  autoFocus?: boolean;
  onChange?: ({ value, label }: OnChangeSelectFunction) => void;
}

export default function CustomSelect({ options, required, autoFocus, onChange }: CustomSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { selectedIndex, options } = e.target;
    const { value, innerText } = options[selectedIndex];

    onChange?.({ value, label: innerText });
  };

  return (
    <select
      className="select select-bordered w-full"
      required={required}
      autoFocus={autoFocus}
      onChange={handleChange}
    >
      {options.map(({ value, label, selected }) => (
        <option
          key={value}
          value={value}
          selected={selected}
        >
          {label}
        </option>
      ))}
    </select>
  );
}
