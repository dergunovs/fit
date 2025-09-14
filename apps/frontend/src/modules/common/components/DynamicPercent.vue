<template>
  <sup
    :class="$style.dynamics"
    :data-positive="(props.percent || 0) > 0"
    :data-negative="(props.percent || 0) < 0"
    data-test="dynamic-percent"
  >
    {{ formatPercent(props.percent || 0) }}
  </sup>
</template>

<script setup lang="ts">
import { formatPercent } from 'mhz-helpers';

interface IProps {
  percent: number | null;
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.dynamics {
  font-size: 0.75rem;
  color: var(--color-gray-dark);

  &[data-positive='true'] {
    color: var(--color-success-dark);
  }

  &[data-negative='true'] {
    font-weight: 700;
    color: var(--color-error);
  }
}
</style>
