<template>
  <sup :class="$style.dynamics" :data-positive="props.percent > 0" :data-negative="props.percent < 0">
    {{ formatStatisticsPercent(props.percent) }}
  </sup>
</template>

<script setup lang="ts">
interface IProps {
  percent: number;
}

const props = defineProps<IProps>();

function formatStatisticsPercent(percent: number) {
  return percent === null ? '' : `${percent > 0 ? `+` : ``}${percent}%`;
}
</script>

<style module lang="scss">
.dynamics {
  font-size: 0.75rem;
  color: var(--color-gray-dark-extra);

  &[data-positive='true'] {
    color: var(--color-success-dark);
  }

  &[data-negative='true'] {
    font-weight: 700;
    color: var(--color-error-dark);
  }
}
</style>
