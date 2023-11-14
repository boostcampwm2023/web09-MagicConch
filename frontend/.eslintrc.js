module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:pretter/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript',
    'plugin:import/recommended',
    'prettier',
  ],
  plugins: ['prettier', 'react-refresh', 'import', 'eslint:recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    // "quotes": [2, "double"],
    quotes: [2, 'double', { avoidEscape: false }],
    // quotes: ["error", "single"],
    'prettier/prettier': 'error',
    semi: ['error', 'always'],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }], // https://github.com/ArnaudBarre/eslint-plugin-react-refresh
    'react/react-in-jsx-scope': 'off', // import React를 반드시 해야하는 옵션(리액트 17부터 생략 가능)
    // 'react/jsx-no-target-blank': 'off', // href안에 _blank 넣을 수 없도록 하는 옵션 -> https://stackoverflow.com/questions/50709625/link-with-target-blank-and-rel-noopener-noreferrer-still-vulnerable
    'prettier/prettier': 'error', // prettier와 충돌처리
    '@typescript-eslint/no-shadow': 'off', // 외부에 선연된 변수 이름을 사용할 수 없도록 하는 옵션
    // 'import/no-unresolved': 'off', // 경로의 파일이 unresolved하는 일이 없도록 하는 옵션, https://cocoze.tistory.com/108
  },
};
