import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  pluginJs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "id-length": [
        "error",
        {
          "min": 2,
          "exceptions": ["e", "i", "j", "k", "d", "x", "y", "a", "b", "_", "q", "t"]
        }
      ],
      "no-console": [
        "error",
        {
          allow: ["info", "warn", "error"],
        }
      ],
      "import/no-duplicates": "error",
      "no-useless-constructor": "error",
      "no-extend-native": "error",
      "arrow-body-style": "error",
      "array-callback-return": "error",
      "eqeqeq": "error",
      "no-use-before-define": "error",
      // this rule is improved in eslint-plugin-import
      'no-unused-vars': "off",
      "import/no-dynamic-require": "warn",
      "import/no-nodejs-modules": "off",
      "import/no-unresolved": "off",
    }
  }
];