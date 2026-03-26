import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import pluginImportX from 'eslint-plugin-import-x';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginSonar from 'eslint-plugin-sonarjs';
import pluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { parser, options, ignores, settings, rules } from 'vue-linters-config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/strongly-recommended'],
  pluginImportX.flatConfigs.recommended,
  pluginSonar.configs.recommended,
  pluginUnicorn.configs.recommended,
  pluginImportX.flatConfigs.typescript,

  ignores,

  parser(vueParser, tseslint.parser, dirname),

  { ...options(globals), ...settings, ...rules },

  pluginPrettierRecommended
);
