import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginImportX from 'eslint-plugin-import-x';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginSonar from 'eslint-plugin-sonarjs';
import pluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { options, ignores, settings, rules } from 'fastify-linters-config';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginSonar.configs.recommended,
  pluginUnicorn.configs.recommended,
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,

  ignores,
  { ...options(globals), ...settings, ...rules },

  pluginPrettierRecommended
);
