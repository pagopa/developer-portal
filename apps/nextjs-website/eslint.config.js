import js from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import parser from '@typescript-eslint/parser';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import pluginFunctional from 'eslint-plugin-functional';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '.turbo/**',
      'dist/**',
      'build/**',
      'out/**',
      '**/*.d.ts'
    ],
  },
  // Browser environment for React/Next.js files
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        // Browser API
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        XMLHttpRequest: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        ReadableStream: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        self: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        // React/Next.js
        React: 'readonly',
        JSX: 'readonly',
        // Node.js (available in Next.js environment)
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        // DOM Types
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLSelectElement: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        Document: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        TouchEvent: 'readonly',
      },
    },
    plugins: {
      '@next/next': pluginNext,
      '@typescript-eslint': pluginTypeScript,
      'functional': pluginFunctional,
      'prettier': pluginPrettier,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable problematic rules
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-redeclare': 'off', // Disable temporarily for migration
      'react-hooks/exhaustive-deps': 'off', // Disable temporarily - missing plugin
      // Functional programming rules (based on project's eslint-functional.js)
      'functional/immutable-data': 'warn',
      'functional/no-expression-statements': 'warn',
      'functional/no-let': 'warn',
      'functional/no-try-statements': 'warn',
      'functional/no-throw-statements': 'warn',
      'functional/no-promise-reject': 'warn',
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          jsxSingleQuote: true,
          trailingComma: 'none',
        },
      ],
    },
  },
  // JavaScript files (no TypeScript parsing)
  {
    files: ['src/**/*.{js,mjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser API
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        React: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      'prettier': pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          jsxSingleQuote: true,
          trailingComma: 'none',
        },
      ],
      'no-unused-vars': 'warn',
    },
  },
  // Node.js environment for config files
  {
    files: ['*.config.{js,mjs,ts}', 'next.config.{js,mjs,ts}', 'jest.config.{js,ts}', 'sst.config.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        sst: 'readonly',
        $config: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      'functional': pluginFunctional,
    },
    rules: {
      ...js.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Functional programming rules - relaxed for config files
      'functional/immutable-data': 'off',
      'functional/no-expression-statements': 'off',
      'functional/no-let': 'warn',
      'functional/no-try-statements': 'off',
      'functional/no-throw-statements': 'off',
      'functional/no-promise-reject': 'off',
    },
  },
  // Jest environment for test files
  {
    files: ['**/__tests__/**/*.{js,ts,tsx}', '**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        vi: 'readonly',
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      'functional': pluginFunctional,
    },
    rules: {
      ...js.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable some rules for tests
      'no-undef': 'off', // Jest globals are handled above
      'react-hooks/exhaustive-deps': 'off',
      // Functional programming rules - relaxed for tests
      'functional/immutable-data': 'off',
      'functional/no-expression-statements': 'off', // Allow describe(), it(), etc.
      'functional/no-let': 'warn',
      'functional/no-try-statements': 'off',
      'functional/no-throw-statements': 'off',
      'functional/no-promise-reject': 'off',
    },
  },
];