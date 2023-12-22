/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      aspectRatio: {
        '2/1': '2 / 1',
        '3/2': '3 / 2',
        '16/10': '16 / 10',
        '21/9': '21 / 9',
      },
    },
  },
  plugins: [],
};
