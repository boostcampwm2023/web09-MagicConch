import { detect } from 'detect-browser';

const browser = detect();

export const __MAC__ = browser?.os?.includes('Mac');
export const __WINDOWS__ = browser?.os?.includes('Window');
