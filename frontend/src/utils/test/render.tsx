import { RenderOptions, render } from '@testing-library/react';
import fs from 'fs';
import React, { FC, ReactElement } from 'react';

const wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export function renderWithTailwind(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const view = render(ui, { wrapper, ...options });

  const style = document.createElement('style');
  style.innerHTML = fs.readFileSync('src/test/index.css', 'utf8');
  document.head.appendChild(style);

  return view;
}
