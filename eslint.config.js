import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    languageOptions: {
      globals: { ...globals.browser, process: "readonly" },
    },

    rules: {
      // Custom rules
      "no-console": "warn", // Allow console statements
      "no-unused-vars": ["warn", { argsIgnorePattern: "req|res|next" }], // Ignore unused variables for req, res, and next
      semi: ["error", "always"], // Enforce semicolons
      quotes: ["error", "single"], // Enforce single quotes
      indent: ["error", 2], // Enforce 2-space indentation
      eqeqeq: "error", // Require === and !==
      "no-var": "error", // Disallow var, use let and const instead
      "prefer-const": "error", // Prefer const over let when variable is not reassigned
      "prettier/prettier": "error", // Integrate Prettier
    },
  },
  pluginJs.configs.recommended,
  prettier, // Extend prettier config
  {
    plugins: {
      prettier: prettierPlugin,
    },
  },
];
