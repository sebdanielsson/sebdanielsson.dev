/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html/html',
    'stylelint-config-html/astro',
  ],
  rules: {
    'color-hex-length': null,
  },
};
