<template>
  <div>
    <UiFlex column>
      <div v-if="!props.isHideTitle" :class="$style.title" data-test="exercise-title">
        {{ props.exercise.exercise?.[localeField('title', locale)] || t('exercise.deleted') }}
      </div>

      <UiFlex wrap>
        <UiChip v-if="!props.exercise.isDone && !props.isHideDuration" type="error" data-test="exercise-is-not-done">
          <IconFail width="14" height="14" /> {{ t('notDone') }}
        </UiChip>

        <UiChip data-test="exercise-repeats">x{{ props.exercise.repeats }}</UiChip>

        <UiChip v-if="props.exercise.weight" data-test="exercise-weight">
          <IconWeight width="14" height="14" />{{ props.exercise.weight }} {{ t('kg') }}
        </UiChip>

        <UiChip v-if="props.exercise.duration" data-test="exercise-duration">
          <IconDuration width="14" height="14" /> {{ formatDuration(props.exercise.duration, locale) }}
        </UiChip>

        <UiChip v-if="props.exercise.isToFailure" type="success" data-test="exercise-to-failure">
          <IconToFailure width="14" height="14" /> {{ t('toFailure') }}
        </UiChip>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { IExerciseDone } from 'fitness-tracker-contracts';
import { useI18n } from 'vue-i18n';
import { UiChip, UiFlex } from 'mhz-ui';
import { formatDuration, localeField } from 'mhz-helpers';

import IconDuration from '@/common/icons/duration.svg';
import IconToFailure from '@/common/icons/to-failure.svg';
import IconFail from '@/common/icons/fail.svg';
import IconWeight from '@/common/icons/weight.svg';

interface IProps {
  exercise: IExerciseDone;
  isHideTitle?: boolean;
  isHideDuration?: boolean;
}

const props = defineProps<IProps>();

const { t, locale } = useI18n();
</script>

<style module lang="scss">
.title {
  font-weight: 700;
  line-height: 1.3;
}
</style>
