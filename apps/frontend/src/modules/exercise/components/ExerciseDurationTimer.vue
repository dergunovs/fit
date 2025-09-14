<template>
  <div :class="$style.timer" :data-active="props.start" data-test="exercise-duration">
    {{ timer }}
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useTimer } from 'mhz-helpers';

interface IProps {
  start: boolean;
  stop: boolean;
}

interface IEmit {
  stop: [duration: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { timer, duration, startTimer, stopTimer } = useTimer();

watch(
  () => [props.start, props.stop],
  () => {
    if (props.start) startTimer();
    if (props.stop) {
      emit('stop', duration.value);
      stopTimer();
    }
  }
);

onMounted(() => {
  if (props.start) startTimer();
});
</script>

<style module lang="scss">
.timer {
  padding: 16px 0;
  font-size: 3rem;
  color: var(--color-gray);
  text-align: center;

  &[data-active='true'] {
    color: var(--color-black);
  }
}

:global(.dark) {
  .timer {
    color: var(--color-gray-dark-extra);

    &[data-active='true'] {
      color: var(--color-gray);
    }
  }
}
</style>
