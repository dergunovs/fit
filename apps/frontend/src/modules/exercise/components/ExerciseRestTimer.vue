<template>
  <div :class="$style.timer">
    <span>{{ t('rest') }}: </span><span data-test="exercise-rest">{{ timer }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useTimer } from 'mhz-helpers';

import { useTI18n } from '@/common/composables';

interface IProps {
  start: boolean;
  stop: boolean;
}

const props = defineProps<IProps>();

const { t } = useTI18n();

const { timer, startTimer, stopTimer } = useTimer();

watch(
  () => [props.start, props.stop],
  () => {
    if (props.start) startTimer();
    if (props.stop) stopTimer();
  }
);

onMounted(() => {
  if (props.start) startTimer();
});
</script>

<style module lang="scss">
.timer {
  padding-bottom: 12px;
  font-size: 2rem;
  color: var(--color-gray-dark);
  text-align: center;
}
</style>
