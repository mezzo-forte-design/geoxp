import sharedConfig from '@geoxp/eslint-config';
import globals from "globals";

/** @type {import("eslint").Linter.Config} */
export default [
  ...sharedConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
    },
  },
];