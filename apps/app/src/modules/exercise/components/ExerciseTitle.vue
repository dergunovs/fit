<template>
  <div>
    <UiFlex column>
      <div v-if="!props.isHideTitle" :class="$style.title">
        {{ props.exercise.exercise?.title || 'Упражнение удалено' }}
      </div>

      <UiFlex wrap>
        <UiChip v-if="!props.exercise.isDone" type="error"> <IconFail width="16" height="16" /> Не выполнено</UiChip>

        <UiChip v-if="props.exercise.duration">
          <IconDuration width="16" height="16" /> {{ formatDuration(props.exercise.duration) }}
        </UiChip>

        <UiChip>x{{ props.exercise.repeats }}</UiChip>

        <UiChip v-if="props.exercise.weight">
          <IconWeight width="16" height="16" />{{ props.exercise.weight }} кг.
        </UiChip>

        <UiChip v-if="props.exercise.isToFailure" type="success">
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
