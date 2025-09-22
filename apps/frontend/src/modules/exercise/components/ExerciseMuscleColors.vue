<template>
  <div :class="$style.container">
    <div :class="$style.muscles">
      <div
        v-for="muscle in props.muscles"
        :key="muscle._id"
        :class="$style.muscle"
        :style="`background: ${muscle.color}; height: ${100 / props.muscles.length}%`"
        data-test="exercise-muscle-color"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMuscle } from 'fitness-tracker-contracts';

interface IProps {
  muscles: IMuscle[];
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-top-left-radius: 8px;
}

.muscles {
  width: 32px;
  height: 32px;
  transform: rotate(45deg) translateX(-8px) translateY(0);
}

.muscle {
  width: 16px;
}
</style>
