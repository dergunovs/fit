import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { parser, options, ignores, settings, rules } from 'vue-linters-config';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/strongly-recommended'],
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,

  ignores,
  parser(vueParser, tseslint.parser),
  { ...options(globals), ...settings, ...rules },

  eslintPluginPrettierRecommended
);
