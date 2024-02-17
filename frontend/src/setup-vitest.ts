import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

import { toBeVisibleSideBar } from '@utils/test/matcher';

expect.extend({
  toBeVisibleSideBar,
});

vi.mock('zustand');

// test 간 DOM 상태를 초기화
afterEach(() => {
  cleanup();
});
