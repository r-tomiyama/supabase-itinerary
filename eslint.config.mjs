import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
 
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 
const compat = new FlatCompat({
  baseDirectory: __dirname,
});
 
export default tseslint.config(
  {
    files: ['*.ts', '*.tsx'], // 読み込むファイル
  },
  {
    ignores: [
      '**/.next/**/*',
      'eslint.config.mjs',
      'postcss.config.js',
      'prettier.config.mjs',
      'src/libs/supabase.types.ts'
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  ...compat.extends('next/core-web-vitals'),
  ...tailwind.configs['flat/recommended'],
  {
    // @typescript-eslintに関する設定
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
        //. custom rules
    },
  },
  {
    // tailwindcssに関する設定
    settings: {
      tailwindcss: {
        whitelist: ['hidden-scrollbar', '-webkit-scrollbar'],
      },
    },
  },
  {
    // eslint-plugin-importに関する設定
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always', // import groups 1行空ける
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
  {
    // eslint-plugin-unused-importsに関する設定
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    // その他設定
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
      globals: {
        React: "readonly",
      },
    },
    rules: {
      "react/jsx-boolean-value": "error", // JSXの中でのbooleanの使用
      "react/jsx-curly-brace-presence": "error", // JSXの中での余分な{}の使用
    },
  },
  eslintConfigPrettier, // Prettierとの競合防止
);
