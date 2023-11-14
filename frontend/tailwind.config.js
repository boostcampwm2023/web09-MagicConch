/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    ({ addComponents }) => {
      const textTheme = {
        '.text-strong': { color: '#14212B' },
        '.text-bold': { color: '#4B5966' },
        '.text-default': { color: '#5E6E76' },
        '.text-weak': { color: '#879298' },
        '.text-white-default': { color: '#FFFFFF' },
        '.bold24': { fontWeight: '700', fontSize: '24px' },
        '.bold16': { fontWeight: '700', fontSize: '16px' },
        '.bold14': { fontWeight: '700', fontSize: '14px' },
        '.bold12': { fontWeight: '700', fontSize: '12px' },
        '.medium16': { fontWeight: '500', fontSize: '16px' },
        '.medium14': { fontWeight: '500', fontSize: '14px' },
        '.medium12': { fontWeight: '500', fontSize: '12px' }
      };
      addComponents(textTheme);
    },
    ({ addComponents }) => {
      const surfaceTheme = {
        '.surface-default': { background: '#181818' },
        '.surface-alt': { background: '#202123' },
        '.surface-point': { background: '#0052F0' },
        '.surface-point-alt': { background: '#7890E7' },
        '.surface-disabled': { background: '#AFABAB' },
        '.surface-content': { background: '#FFFFFF' },
        '.surface-box': { background: '#ECECEC' },
        '.surface-box-alt': { background: '#7390B1' },
      };
      addComponents(surfaceTheme);
    },
    ({ addComponents }) => {
      const borderTheme = {
        '.border-default': { border: '1px soild #FFFFFF' },
        '.border-bold': { border: '1px soild #6E8091' },
      };
      addComponents(borderTheme);
    },
    ({ addComponents }) => {
      const shadowTheme = {
        '.shadow-chat': { boxShadow: '0px 0px 8px 8px rgba(255, 255, 255, 0.10);' },
        '.shadow-popup': { boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' },
      };
      addComponents(shadowTheme);
    }
  ],
};
