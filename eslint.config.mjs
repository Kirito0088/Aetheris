// @ts-check
import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript + React files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      // Browser + Node globals for Next.js (SSR + client)
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // TypeScript recommended rules
      ...tsPlugin.configs["recommended"].rules,

      // Next.js core web vitals rules
      ...nextPlugin.configs["recommended"].rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // React hooks rules
      ...reactHooksPlugin.configs.recommended.rules,

      // Custom Aetheris rules
      // Warn on console.log — allow warn/error for observability (SYSTEM_ARCHITECTURE.md Principle 10)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",

      // Prevent deeply nested relative imports — enforce @/* aliases (ENGINEERING_STANDARDS.md)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../../*", "../../../../*"],
              message: "Use @/* path aliases instead of deep relative imports.",
            },
          ],
        },
      ],

      // TypeScript — type-only imports keep module boundaries clean
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Disable rules that conflict with modern React / Next.js patterns
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off", // TypeScript handles this more accurately
    },
  },

  // Ignore patterns
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "eslint.config.mjs",
      "postcss.config.mjs",
      "next.config.ts",
    ],
  },
];

export default eslintConfig;
