type MatcherResult = {
  message: () => string;
  pass: boolean;
};

export interface CustomMatchers<R = unknown> {
  toBeCenterOfScreenX(): R;
  toBeLeftOfScreenX(): R;
}

const ALLOWABLE_MARGIN = 100;

function compare(a: number, b: number): number {
  if (a < b - ALLOWABLE_MARGIN) {
    return -1;
  } else if (a > b + ALLOWABLE_MARGIN) {
    return 1;
  }
  return 0;
}

export function toBeCenterOfScreenX(received: HTMLElement): MatcherResult {
  const rect = received.getBoundingClientRect();
  const middleOfRectX = rect.left + rect.width / 2;

  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const middleOfScreenX = screenWidth / 2;

  const pass = compare(middleOfRectX, middleOfScreenX) === 0;

  if (pass) {
    return {
      message: () => `expected not to be centered horizontally`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected to be centered horizontally`,
      pass: false,
    };
  }
}

export function toBeLeftOfScreenX(received: HTMLElement): MatcherResult {
  const rect = received.getBoundingClientRect();
  const middleOfRectX = rect.left + rect.width / 2;

  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const middleOfScreenX = screenWidth / 2;

  const pass = compare(middleOfRectX, middleOfScreenX) === -1;

  if (pass) {
    return {
      message: () => `expected not to be left of screen`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected to be left of screen`,
      pass: false,
    };
  }
}
