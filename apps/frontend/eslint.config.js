import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginSonar from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { parser, options, ignores, settings, rules } from 'vue-linters-config';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/strongly-recommended'],
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginSonar.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  eslintPluginImportX.flatConfigs.typescript,

  ignores,
  parser(vueParser, tseslint.parser),
  {
    ...options(globals),
    ...settings,
    rules: {
      ...rules.rules,
      'sonarjs/no-hardcoded-passwords': 'off',
      'sonarjs/no-duplicated-branches': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/no-array-reduce': 'off',
    },
  },

  eslintPluginPrettierRecommended
);
