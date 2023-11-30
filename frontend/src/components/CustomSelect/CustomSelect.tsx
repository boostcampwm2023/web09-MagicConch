import { useEffect, useRef, useState } from 'react';

import { Icon } from '@iconify/react';

export interface CustomSelectOptions {
  value: string;
  label: string;
}

interface CustomSelectProps {
  width?: string;
  options: CustomSelectOptions[];
  autoFocus?: boolean;
  onChange?: ({ value, label }: CustomSelectOptions) => void;
}

export default function CustomSelect({ width, options, autoFocus, onChange }: CustomSelectProps) {
  const [opened, setOpened] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<CustomSelectOptions>({ value: '', label: '' });

  useEffect(() => {
    if (options.length) setSelected(options[0]);
  }, [options]);

  const updateOption = (option: CustomSelectOptions) => {
    inputRef.current?.click();
    if (option.value !== selected.value) {
      setSelected(option);
      onChange?.(option);
    }
  };

  return (
    <div className="relative">
      <div className={`collapse ${width ?? 'w-300'} min-h-48 bg-white border border-gray-300`}>
        <input
          title={selected.label}
          ref={inputRef}
          type="checkbox"
          className="min-h-48"
          onClick={() => setOpened(!opened)}
        />
        <div className="relative collapse-title w-full leading-48 min-h-48 focus:outline-none  py-0 px-15">
          {selected.label}
          <Icon
            icon="teenyicons:down-solid"
            className="h-48 transition-transform absolute top-0 right-15"
            transform={`${opened ? 'rotate(180)' : 'rotate(0)'}`}
          />
        </div>
        <div
          className={`collapse-content w-full max-h-130 overflow-auto z-1000`}
          autoFocus={autoFocus}
        >
          {options.map(({ value, label }) => (
            <p
              className={`display-medium14  ${selected.value === value && 'text-point font-bold'}
                        leading-24 p-0 py-8 hover:bg-gray-100`}
              key={value}
              title={selected.label}
              onClick={() => updateOption({ value, label })}
            >
              {label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
