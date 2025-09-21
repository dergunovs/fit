<template>
  <div v-if="!props.isHide" :class="$style.muscles">
    <div
      v-for="muscle in props.muscles"
      :key="muscle._id"
      :class="$style.muscle"
      :style="`background: ${muscle.color}; height: ${100 / props.muscles.length}%`"
      data-test="exercise-muscle-color"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { IMuscle } from 'fitness-tracker-contracts';

interface IProps {
  muscles: IMuscle[];
  isHide?: boolean;
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.muscles {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 32px;
  height: 32px;
  rotate: 45deg;
}

.muscle {
  width: 16px;
}
</style>
