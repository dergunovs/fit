<template>
  <UiField :label="`${t('weight')}, ${t('kg')}`">
    <UiSelect
      @update:modelValue="(option) => emit('update:modelValue', Number(option))"
      :modelValue="props.modelValue"
      :options="props.options"
      :lang="locale"
      data-test="exercise-weight"
    />
  </UiField>
</template>

<script setup lang="ts">
import { UiField, UiSelect } from 'mhz-ui';

import { useTI18n } from '@/common/composables';

interface IProps {
  options: number[];
  modelValue?: number;
}

interface IEmit {
  'update:modelValue': [option: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useTI18n();
</script>
