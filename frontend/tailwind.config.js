const ROOT_PX = 16;
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i / ROOT_PX}rem`) };
const px0_2000 = { ...Array.from(Array(2001)).map((_, i) => `${i / ROOT_PX}rem`) };

/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: px0_2000,
      height: px0_2000,
      maxWidth: px0_2000,
      maxHeight: px0_2000,
      minWidth: px0_2000,
      minHeight: px0_2000,
      borderWidth: px0_100,
      gap: px0_100,
      padding: px0_100,
      margin: px0_2000,
      lineHeight: px0_100,
      fontSize: px0_100,
      inset: px0_2000,
      translate: px0_2000,
      rotate: px0_2000,
      skew: px0_2000,
      keyframes: {
        shining: {
          '0%': { filter: 'drop-shadow(0px 0px 25px rgba(255, 255, 255, 0.8))' },
          '100%': { filter: 'drop-shadow(0px 0px 50px rgba(255, 255, 255, 0.8))' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        tarotHovering: {
          '0%': { transform: 'translateY(-1000px)' },
          '100%': { transform: 'scale(1.02) translateY(-1000px)' },
        },
        tarotLeaving: {
          '0%': { transform: 'scale(1.02) translateY(-1000px)' },
          '100%': { transform: 'translateY(-1000x)' },
        },
      },
      animation: {
        shining: 'shining 2s ease-in-out infinite alternate',
        fadeIn: 'fadeIn 1.5s ease-in-out',
        fadeOut: 'fadeOut 1.5s ease-in-out forwards',
        tarotHovering: 'tarotHovering 1s ease-in-out forwards',
        tarotLeaving: 'tarotLeaving 1s ease-in-out forwards',
      },
    },
  },
  plugins: [
    require('daisyui'),
    ({ addComponents }) => {
      const themeBase = {
        bold_L: { fontWeight: '700', fontSize: '24px' },
        bold_M: { fontWeight: '700', fontSize: '16px' },
        bold_R: { fontWeight: '700', fontSize: '14px' },
        bold_S: { fontWeight: '700', fontSize: '12px' },
        medium_M: { fontWeight: '500', fontSize: '16px' },
        medium_R: { fontWeight: '500', fontSize: '14px' },
        medium_S: { fontWeight: '500', fontSize: '12px' },
      };

      const textTheme = {
        '.text-strong': { color: '#14212B' },
        '.text-bold': { color: '#4B5966' },
        '.text-default': { color: '#5E6E76' },
        '.text-weak': { color: '#879298' },
        '.text-white-default': { color: '#FFFFFF' },
        '.display-bold24': themeBase.bold_L,
        '.display-bold16': themeBase.bold_M,
        '.display-bold14': themeBase.bold_R,
        '.display-bold12': themeBase.bold_S,
        '.display-medium16': themeBase.medium_M,
        '.display-medium14': themeBase.medium_R,
        '.display-medium12': themeBase.medium_S,
        '.available-medium16': themeBase.medium_M,
        '.available-medium14': themeBase.medium_R,
        '.available-medium12': themeBase.medium_S,
        '.hover-medium16': {
          ...themeBase.medium_M,
          textDecoration: 'underline',
        },
        '.hover-medium14': {
          ...themeBase.medium_R,
          textDecoration: 'underline',
        },
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
    },
    ({ addUtilities }) => {
      const flexUtils = {
        '.flex-all-center': {
          justifyContent: 'center',
          alignItems: 'center',
        },
      };
      addUtilities(flexUtils);
    },
  ],
};
