<template>
  <div :class="$style.exercise" :data-hide="props.isHideTitle">
    <UiFlex column gap="2" align="flex-start">
      <div v-if="!props.isHideTitle" data-test="exercise-choosen-title">
        {{ title }}
      </div>

      <ExerciseButtons
        v-if="props.exercise._id"
        :isEdit="props.isEdit"
        :repeats="props.exercise.repeats"
        :weight="props.exercise.weight"
        :index="props.index"
        :isLast="props.isLast"
        :isSetCreatable="props.isSetCreatable"
        :isDone="props.isDone"
        :isToFailure="props.isToFailure"
        :duration="props.duration"
        :isFutureActivity="props.isFutureActivity"
        @createSet="emit('createSet')"
        @delete="emit('delete', props.exercise._id)"
        @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
        data-test="exercise-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IExerciseChoosen } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';
import { localeField } from 'mhz-helpers';

import ExerciseButtons from '@/exercise/components/ExerciseButtons.vue';

import { useTI18n } from '@/common/composables';

interface IProps {
  exercise: IExerciseChoosen;
  index: number;
  isEdit?: boolean;
  isSetCreatable?: boolean;
  isLast?: boolean;
  isHideTitle?: boolean;
  isDone?: boolean;
  isToFailure?: boolean;
  duration?: number;
  isFutureActivity?: boolean;
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useTI18n();

const title = computed(() => {
  const isExerciseExists = !!props.exercise.exercise;

  if (!isExerciseExists) return t('exercise.deleted');

  const exerciseTitle = props.exercise.exercise?.[localeField('title', locale.value)];

  if (!props.isEdit) return exerciseTitle;

  return `${props.index + 1}. ${exerciseTitle}`;
});
</script>

<style module lang="scss">
.exercise {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 6px 10px;
  background-color: var(--color-gray-light-extra);
  border-bottom: 1px solid var(--color-gray);
  border-radius: 10px;

  &[data-hide='true'] {
    margin-top: -14px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
