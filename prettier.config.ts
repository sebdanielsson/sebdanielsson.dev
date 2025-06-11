import { type Config } from 'prettier';

const config: Config = {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  printWidth: 100,
};

export default config;
