import { Assertion, AsymmetricMatchersContaining } from 'vitest';

import { CustomMatchers } from '@utils/matchers';

declare module 'vitest' {
  type Assertion<T = any> = Assertion<T> & CustomMatchers<T>;
  type AsymmetricMatchersContaining = AsymmetricMatchersContaining & CustomMatchers;
}
