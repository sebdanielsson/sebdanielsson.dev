// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
  {
    files: ['src/**/*.{js,ts,jsx,tsx,astro}'],
    ignores: [],
    rules: {},
  },
];
