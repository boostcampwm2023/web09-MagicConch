import { useEffect, useRef, useState } from 'react';

import { Icon } from '@iconify/react';

export interface SelectOptions {
  value: string;
  label: string;
}

interface SelectProps {
  width?: string;
  options: SelectOptions[];
  defaultId?: string;
  autoFocus?: boolean;
  onChange?: ({ value, label }: SelectOptions) => void;
}

export default function Select({ width, options, autoFocus, defaultId, onChange }: SelectProps) {
  const [opened, setOpened] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<SelectOptions>({ value: '', label: '' });

  useEffect(() => {
    if (options.length && !selected.value && !selected.label) {
      const defaultOption = options.find(({ value }) => value === defaultId);
      setSelected(defaultOption ?? options[0]);
    }
  }, [options]);

  const updateOption = (option: SelectOptions) => {
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
        <div className="truncate collapse-title w-full leading-48 min-h-48 focus:outline-none flex justify-between py-0 px-15">
          {selected.label}
          <Icon
            icon="teenyicons:down-solid"
            className="h-48 transition-transform absolute top-0 right-15"
            transform={`${opened ? 'rotate(180)' : 'rotate(0)'}`}
          />
        </div>
        <div
          className={`truncate collapse-content w-full max-h-110 sm:max-h-80 overflow-auto`}
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
