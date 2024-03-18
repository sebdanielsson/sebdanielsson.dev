/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:astro/recommended', 'plugin:@typescript-eslint/strict'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
  ],
};
