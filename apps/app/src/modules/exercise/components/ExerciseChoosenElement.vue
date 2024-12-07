<template>
  <div :class="$style.exercise">
    <span>{{ exerciseTitle }}</span>
    <button @click="emit('delete', props.exercise._id)" :class="$style.delete" type="button">×</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

interface IProps {
  exercise: IExerciseChoosen;
  index: number;
}

const props = defineProps<IProps>();
const emit = defineEmits(['delete']);

const exerciseTitle = computed(() => `${props.index}. ${props.exercise.exercise?.title} x${props.exercise.repeats}`);
</script>

<style module lang="scss">
.exercise {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background-color: var(--color-gray-light);
  border-radius: 16px;
}

.delete {
  width: 32px;
  padding: 0;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
