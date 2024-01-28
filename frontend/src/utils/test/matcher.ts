import animationNames from '@constants/animation';

type MatcherResult = {
  message: () => string;
  pass: boolean;
};

export interface CustomMatchers<R = unknown> {
  toBeVisibleSideBar(): R;
}

export function toBeVisibleSideBar(received: HTMLElement): MatcherResult {
  const classList = received.classList;
  const pass = classList.contains(animationNames.SHOW_SIDEBAR);

  if (pass) {
    return {
      message: () => `expected to be visible side bar`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected not to be visible side bar`,
      pass: false,
    };
  }
}
