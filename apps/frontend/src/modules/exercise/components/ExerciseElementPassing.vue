<template>
  <div :class="$style.element" :data-active="props.isActive" data-test="exercise-passing-element">
    <UiButton
      v-if="props.exercise._id"
      @click="handleClick(props.exercise._id, props.isActive)"
      isLargeFont
      :isDisabled="isButtonDisabled"
      isTall
      data-test="exercise-passing-button"
    >
      {{ props.isActive ? t('finish') : t('start') }}
    </UiButton>

    <UiCheckbox
      v-model="isToFailure"
      :label="t('exercise.doneToFailure')"
      :isDisabled="!props.isActive"
      data-test="exercise-passing-to-failure"
    />

    <ExerciseDurationTimer
      :start="start"
      :stop="stop"
      @stop="(duration) => emit('stop', props.exercise, duration, isToFailure)"
      data-test="exercise-passing-duration"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiCheckbox } from 'mhz-ui';
import { IExerciseDone } from 'fitness-tracker-contracts';

import ExerciseDurationTimer from '@/exercise/components/ExerciseDurationTimer.vue';

import { useTI18n } from '@/common/composables';

interface IProps {
  exercise: IExerciseDone;
  isActive: boolean;
}

interface IEmit {
  start: [id: string];
  stop: [exercise: IExerciseDone, duration: number, isToFailure: boolean];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t } = useTI18n();

const isButtonDisabled = ref(false);

const start = ref(false);
const stop = ref(false);

const isToFailure = ref(false);

function handleClick(id: string, isActive: boolean) {
  isButtonDisabled.value = true;

  emit('start', id);

  start.value = !isActive;
  stop.value = isActive;

  setTimeout(() => {
    isButtonDisabled.value = false;

    if (isActive) {
      isToFailure.value = false;
    }
  }, 500);
}
</script>

<style module lang="scss">
.element {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 12px 0;
  margin-top: 12px;
  margin-bottom: 8px;
  border-top: 16px solid var(--color-gray);
  border-bottom: 16px solid var(--color-gray);

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

:global(.dark) {
  .element {
    border-top: 16px solid var(--color-gray-dark-extra);
    border-bottom: 16px solid var(--color-gray-dark-extra);
  }
}
</style>
