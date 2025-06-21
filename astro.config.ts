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
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  image: {
    responsiveStyles: true,
  },
  experimental: {
    liveContentCollections: true,
    csp: {
      directives: [
        "default-src 'self' https://plausible.hogwarts.zone https://static.cloudflareinsights.com",
      ],
    },
  },
});
