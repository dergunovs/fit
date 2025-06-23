<template>
  <div
    v-if="!props.exercise.isDone"
    :class="$style.element"
    :data-current="props.isCurrentExercise"
    :data-active="isCurrentExerciseActive"
    data-test="exercise-element"
  >
    <div :class="$style.title" :data-current="props.isCurrentExercise" data-test="exercise-title">
      {{
        getExercisePassingTitle(
          props.index,
          props.isCurrentExercise,
          props.exercisesCount,
          props.exercise,
          t('kg'),
          locale
        )
      }}
    </div>

    <template v-if="props.isCurrentExercise">
      <UiButton @click="handleClick" :isDisabled="isButtonDisabled" isTall data-test="exercise-button">
        {{ buttonTitle }}
      </UiButton>

      <UiCheckbox
        v-model="isToFailure"
        :label="t('exercise.doneToFailure')"
        :isDisabled="!isCurrentExerciseActive"
        data-test="exercise-to-failure"
      />

      <ExerciseRepeatsChoice
        v-model="repeats"
        :options="repeatsOptions"
        :title="t('repeat.many')"
        isTall
        data-test="exercise-repeats"
      />

      <ExerciseDurationTimer :start="start" :stop="stop" @stop="sendDurationData" data-test="exercise-duration" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { UiButton, UiCheckbox } from 'mhz-ui';
import { IExerciseDone } from 'fitness-tracker-contracts';

import ExerciseDurationTimer from '@/exercise/components/ExerciseDurationTimer.vue';
import ExerciseRepeatsChoice from '@/exercise/components/ExerciseRepeatsChoice.vue';

import { getExercisePassingTitle } from '@/exercise/helpers';

interface IProps {
  exercise: IExerciseDone;
  activeExerciseId?: string;
  isCurrentExercise: boolean;
  index: number;
  exercisesCount: number;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ start: [id: string]; stop: [exerciseDone: IExerciseDone] }>();

const { t, locale } = useI18n();

const start = ref(false);
const stop = ref(false);

const isToFailure = ref(false);
const repeats = ref(props.exercise.repeats);

const isCurrentExerciseActive = computed(() => props.exercise._id === props.activeExerciseId);

const isButtonDisabled = ref(false);

const repeatsOptions = [
  props.exercise.repeats - 2,
  props.exercise.repeats - 1,
  props.exercise.repeats,
  props.exercise.repeats + 1,
  props.exercise.repeats + 2,
];

const buttonTitle = computed(() => (isCurrentExerciseActive.value ? t('finish') : t('start')));

watch(
  () => props.isCurrentExercise,
  () => {
    if (props.isCurrentExercise) {
      isButtonDisabled.value = true;

      setTimeout(() => {
        isButtonDisabled.value = false;
      }, 500);
    }
  }
);

function handleClick() {
  if (!props.exercise._id) return;

  isButtonDisabled.value = true;

  if (!isCurrentExerciseActive.value) emit('start', props.exercise._id);

  start.value = !isCurrentExerciseActive.value;
  stop.value = isCurrentExerciseActive.value;

  setTimeout(() => {
    isButtonDisabled.value = false;
  }, 500);
}

function sendDurationData(duration: number) {
  emit('stop', { _id: props.exercise._id, duration, isToFailure: isToFailure.value, repeats: repeats.value });
}
</script>

<style module lang="scss">
.element {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &[data-current='true'] {
    padding: 8px 0;
    border-top: 16px solid var(--color-gray);
    border-bottom: 16px solid var(--color-gray);
  }

  &[data-active='true'] {
    border-color: var(--color-transparent);

    &::before,
    &::after {
      position: absolute;
      right: 0;
      left: 0;
      z-index: 1;
      height: 16px;
      pointer-events: none;
      content: '';
      background-image: repeating-linear-gradient(
        -45deg,
        var(--color-success),
        var(--color-success) 16px,
        var(--color-success-dark) 0,
        var(--color-success-dark) 24px
      );
      background-size: 24px 24px;
      animation: stripeMove 1000ms linear infinite;
    }

    &::before {
      top: -16px;
    }

    &::after {
      bottom: -16px;
    }
  }
}

@keyframes stripeMove {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 24px 0;
  }
}

.title {
  display: flex;
  gap: 4px;
  align-items: center;
  color: var(--color-gray-dark-extra);

  &[data-current='true'] {
    font-weight: 700;
    color: var(--color-black);
  }
}
</style>
