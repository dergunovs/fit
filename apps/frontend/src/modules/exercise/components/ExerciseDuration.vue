<template>
  <div :class="$style.timer" :data-active="props.start" data-test="exercise-duration">
    <span>{{ addZero(minutes) }}</span
    >:<span>{{ addZero(seconds) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { addZero } from 'mhz-helpers';

interface IProps {
  start: boolean;
  stop: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ stop: [duration: number] }>();

watch(
  () => [props.start, props.stop],
  () => {
    if (props.start) startTimer();
    if (props.stop) stopTimer();
  }
);

const seconds = ref(0);
const minutes = ref(0);

// eslint-disable-next-line no-undef
let interval: NodeJS.Timeout;

function updateTime() {
  seconds.value++;

  if (seconds.value === 60) {
    minutes.value++;
    seconds.value = 0;
  }
}

function startTimer() {
  interval = setInterval(updateTime, 1000);
}

function stopTimer() {
  emit('stop', minutes.value * 60 + seconds.value);
  clearInterval(interval);
}

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
</style>
