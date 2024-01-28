type MatcherResult = {
  message: () => string;
  pass: boolean;
};

export interface CustomMatchers<R = unknown> {
  toBeVisibleSideBar(): R;
}

export function toBeVisibleSideBar(received: HTMLElement): MatcherResult {
  const marginRight = window.getComputedStyle(received).getPropertyValue('margin-right');
  console.log(marginRight);
  const pass = marginRight === '-100%';

  if (pass) {
    return {
      message: () => `expected not to be visible side bar`,
      pass: false,
    };
  } else {
    return {
      message: () => `expected to be visible side bar`,
      pass: true,
    };
  }
}
