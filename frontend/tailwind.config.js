const ROOT_PX = 16;
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i / ROOT_PX}rem`) };
const px0_2000 = { ...Array.from(Array(2001)).map((_, i) => `${i / ROOT_PX}rem`) };

/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: { min: '280px', max: '767px' },
      md: { min: '768px', max: '1023px' },
      lg: { min: '1024px' },
    },
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
          '100%': { transform: 'translateY(-1000px)' },
        },
        openingSidebar: {
          '0%': { right: '-500px' },
          '100%': { right: 0 },
        },
        closingSidebar: {
          '0%': { right: 0 },
          '100%': { right: '-500px' },
        },
        contentSideWithOpeningSidebar: {
          '0%': { width: '100%' },
          '100%': { width: 'calc(100% - 500px)' },
        },
        contentSideWithClosingSidebar: {
          '0%': { width: 'calc(100% - 500px)' },
          '100%': { width: '100%' },
        },
        flappingCard: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(30deg)' },
        },
        flippingCard: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
      animation: {
        shining: 'shining 2s ease-in-out infinite alternate',
        fadeIn: 'fadeIn 1.5s ease-in-out',
        fadeOut: 'fadeOut 2.5s ease-in-out forwards',
        tarotHovering: 'tarotHovering 0.5s ease-in-out forwards',
        tarotLeaving: 'tarotLeaving 0.3s ease-in-out forwards',
        openingSidebar: 'openingSidebar 0.5s ease-in-out forwards',
        closingSidebar: 'closingSidebar 0.5s ease-in-out forwards',
        contentSideWithOpeningSidebar: 'contentSideWithOpeningSidebar 0.5s ease-in-out forwards',
        contentSideWithClosingSidebar: 'contentSideWithClosingSidebar 0.5s ease-in-out forwards',
        flappingCard: 'flappingCard 1s ease-in-out forwards infinite alternate',
        flippingCard: 'flippingCard 1s ease-in-out forwards',
      },
      backgroundImage: {
        ddung: "url('/ddung.png')",
        sponge: "url('/sponge.png')",
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
        '.text-point': { color: '#7890E7' },
        '.text-strong': { color: '#14212B' },
        '.text-bold': { color: '#4B5966' },
        '.text-default': { color: '#5E6E76' },
        '.text-weak': { color: '#879298' },
        '.text-white-default': { color: '#FFFFFF' },
        '.kakao-icon': { color: '#FEE500' },
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
        '.shadow-point': { boxShadow: '0px 0px 15px 15px rgba(120, 144, 231, 0.4);' },
        '.shadow-white': { boxShadow: '0px 0px 10px 10px rgba(255, 255, 255, 0.15);' },
        '.shadow-popup': { boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' },
      };
      addComponents(shadowTheme);
    },
    ({ addComponents }) => {
      const cursorTheme = {
        '.cursor': {
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '50%',
          position: 'absolute',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center',
          pointerEvents: 'none',
          willChange: 'transform',
          mixBlendMode: 'difference',
          background: '#fff',
        },
        '.cursor:has(~ div button:hover), .cursor:has(~ div input:hover), .cursor:has(~ div a:hover), .cursor:has(~ div audio:hover), .cursor:has(~ div .collapse-content:hover), .cursor:has(~ div .result:hover)':
          {
            transition: 'transform 0.1s ease-in-out',
            transform: 'translate(-50%, -50%) scale(2)',
          },
      };
      addComponents(cursorTheme);
    },
    ({ addUtilities }) => {
      const sizeUtil = {
        '.flex-with-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '.w-h-full': {
          width: '100%',
          height: '100%',
        },
        '.w-h-screen': {
          width: '100vw',
          height: '100vh',
        },
      };
      addUtilities(sizeUtil);
    },
  ],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
