<template>
  <div data-test="exercise-title">{{ title }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { localeField } from 'mhz-helpers';
import { IExercise } from 'fitness-tracker-contracts';

import { useTI18n } from '@/common/composables';

interface IProps {
  index: number;
  exercise?: IExercise;
  exercisesCount?: number;
  isEdit?: boolean;
  isPassing?: boolean;
}

const props = defineProps<IProps>();

const { t, locale } = useTI18n();

const title = computed(() => {
  const isExerciseExists = !!props.exercise;

  if (!isExerciseExists) return t('exercise.deleted');

  const exerciseTitle = props.exercise[localeField('title', locale.value)];

  if (props.isPassing) return `${props.index + 1} - ${props.exercisesCount}. ${exerciseTitle}`;

  if (!props.isEdit) return exerciseTitle;

  return `${props.index + 1}. ${exerciseTitle}`;
});
</script>
