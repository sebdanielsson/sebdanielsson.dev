// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: ['dist', '.astro'],
  },
  {
    files: ['src/**/*.{js,ts,jsx,tsx,astro}'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
];
