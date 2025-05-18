<template>
  <div :class="$style.timeline">
    <div
      v-for="(step, index) in generateTimeline(props.exercises, props.start, ratio)"
      :key="index"
      :class="$style.step"
      :data-type="step.type"
      :style="{ left: `${step.left}px`, right: `${step.right}px`, width: `${step.right - step.left}px` }"
      data-test="activity-timeline-step"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IExerciseDone } from 'fitness-tracker-contracts';

import { generateTimeline } from '@/exercise/helpers';

interface IProps {
  exercises: IExerciseDone[];
  start: Date | string | null;
}

const props = defineProps<IProps>();

const width = 308;

const lastStepDate = props.exercises[props.exercises.length - 1].dateUpdated;

const ratio =
  lastStepDate && props.start ? (new Date(lastStepDate).getTime() - new Date(props.start).getTime()) / width : 0;

const widthWithPx = computed(() => `${width}px`);
</script>

<style module lang="scss">
.timeline {
  position: relative;
  width: v-bind(widthWithPx);
  height: 40px;
  margin-bottom: 8px;
  border-radius: 8px;
}

.step {
  position: absolute;
  height: 40px;

  &[data-type='rest'] {
    background-color: var(--color-gray);
  }

  &[data-type='exercise'] {
    background-color: var(--color-primary);
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
</style>
