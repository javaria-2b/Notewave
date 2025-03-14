import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL(".", import.meta.url)),
  recommendedConfig: {},
  allConfig: {},
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

eslintConfig[0].rules = {
  ...eslintConfig[0].rules,
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-explicit-any': 'warn',
  'react-hooks/exhaustive-deps': 'warn',
  'react/no-unescaped-entities': 'warn',
  '@typescript-eslint/no-empty-object-type': 'warn',
};

export default eslintConfig;
