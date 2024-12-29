<template>
  <div>
    <UiFlex column>
      <div v-if="!props.isHideTitle" :class="$style.title" data-test="exercise-title">
        {{ props.exercise.exercise?.title || EXERCISE_DELETED_TITLE }}
      </div>

      <UiFlex wrap>
        <UiChip v-if="!props.exercise.isDone" type="error" data-test="exercise-is-not-done">
          <IconFail width="16" height="16" /> Не выполнено
        </UiChip>

        <UiChip data-test="exercise-repeats">x{{ props.exercise.repeats }}</UiChip>

        <UiChip v-if="props.exercise.weight" data-test="exercise-weight">
          <IconWeight width="16" height="16" />{{ props.exercise.weight }} кг.
        </UiChip>

        <UiChip v-if="props.exercise.duration" data-test="exercise-duration">
          <IconDuration width="16" height="16" /> {{ formatDuration(props.exercise.duration) }}
        </UiChip>

        <UiChip v-if="props.exercise.isToFailure" type="success" data-test="exercise-to-failure">
          <IconToFailure width="16" height="16" /> До отказа
        </UiChip>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { IExerciseDone } from 'fitness-tracker-contracts';
import { UiChip, UiFlex } from 'mhz-ui';
import { formatDuration } from 'mhz-helpers';

import IconDuration from '@/common/icons/duration.svg';
import IconToFailure from '@/common/icons/to-failure.svg';
import IconFail from '@/common/icons/fail.svg';
import IconWeight from '@/common/icons/weight.svg';

import { EXERCISE_DELETED_TITLE } from '@/exercise/constants';

interface IProps {
  exercise: IExerciseDone;
  isHideTitle?: boolean;
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.title {
  font-weight: 700;
  line-height: 1.3;
}
</style>
