// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://sebdanielsson.dev',
  security: {
    checkOrigin: true,
  },
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
      lineNumbers: true,
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    responsiveImages: true,
  },
});
