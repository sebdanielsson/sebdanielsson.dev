import type { Config } from "stylelint";

export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-html/html",
    "stylelint-config-html/astro",
  ],
  rules: {
    "import-notation": null,
    "color-hex-length": null,
    "declaration-property-value-no-unknown": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["theme", "source", "utility", "variant", "custom-variant", "plugin"],
      },
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"],
      },
    ],
  },
} satisfies Config;
