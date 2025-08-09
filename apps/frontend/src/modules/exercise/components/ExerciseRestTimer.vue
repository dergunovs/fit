<template>
  <div :class="$style.timer">
    <span>{{ t('rest') }}: </span><span data-test="exercise-rest">{{ timer }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTimer } from 'mhz-helpers';

const { t } = useI18n();

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
  color: var(--color-gray-dark-extra);
  text-align: center;
}
</style>
