<template>
  <UiButtongroup
    @update:modelValue="(option) => emit('update:modelValue', option)"
    :modelValue="props.modelValue"
    :options="repeats"
    :title="t('repeat.many')"
    :isTall="props.isTall"
    isInput
    data-test="exercise-repeats"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UiButtongroup } from 'mhz-ui';

import { EXERCISE_REPEATS_OPTIONS } from '@/exercise/constants';
import { useTI18n } from '@/common/composables';

interface IProps {
  modelValue: number;
  options?: number[];
  isTall?: boolean;
  baseRepeat?: number;
}

interface IEmit {
  'update:modelValue': [option: number];
}

const props = withDefaults(defineProps<IProps>(), {
  options: () => EXERCISE_REPEATS_OPTIONS,
  baseRepeat: undefined,
});

const emit = defineEmits<IEmit>();

const { t } = useTI18n();

const repeats = computed<number[]>(() =>
  props.baseRepeat
    ? [props.baseRepeat - 2, props.baseRepeat - 1, props.baseRepeat, props.baseRepeat + 1, props.baseRepeat + 2]
    : props.options
);
</script>
