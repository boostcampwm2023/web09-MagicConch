type MatcherResult = {
  message: () => string;
  pass: boolean;
};

export interface CustomMatchers<R = unknown> {
  toBeCenterOfScreenX(): R;
}

export function toBeCenterOfScreenX(received: HTMLElement): MatcherResult {
  const element = received as unknown as HTMLElement;
  const rect = element.getBoundingClientRect();
  const middleOfRectX = rect.left + rect.width / 2;

  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const middleOfScreenX = screenWidth / 2;

  const pass = middleOfScreenX - 100 < middleOfRectX && middleOfRectX < middleOfScreenX + 100;

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
