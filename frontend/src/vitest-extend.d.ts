import 'vitest';

declare module 'vitest' {
  export interface Assertion<T = any> extends Assertion {
    toBeVisibleSideBar(): Assertion;
  }
}
