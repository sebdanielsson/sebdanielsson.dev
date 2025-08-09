import { defineConfig, fontProviders, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://sebdanielsson.dev',
  env: {
    schema: {
      GITHUB_USER: envField.string({ context: 'server', access: 'public', optional: false }),
      GITHUB_REPO: envField.string({ context: 'server', access: 'public', optional: false }),
      COMMIT_ID: envField.string({ context: 'server', access: 'public', optional: false }),
      GH_API: envField.string({ context: 'server', access: 'secret', optional: false }),
    },
    validateSecrets: true,
  },
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
    /* csp: {
      directives: [
        "default-src 'self' https://plausible.hogwarts.zone https://static.cloudflareinsights.com",
      ],
    }, */
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'Kalam',
        cssVariable: '--font-kalam',
      },
    ],
  },
});
