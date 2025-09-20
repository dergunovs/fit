<template>
  <div :class="$style.timer">
    <span>{{ t('rest') }}: </span><span data-test="exercise-rest">{{ timer }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useTimer } from 'mhz-helpers';

import { useTI18n } from '@/common/composables';

const { t } = useTI18n();

const { timer, startTimer, stopTimer } = useTimer();

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
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
