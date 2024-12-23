<template>
  <div :class="$style.list">
    <UiFlex gap="4">
      <button
        v-for="group in muscleGroups"
        :key="group._id"
        @click="setCurrentGroup(group._id)"
        type="button"
        :class="$style.button"
        :data-current="group._id === currentMuscleGroup"
        data-test="exercise-muscle-group"
      >
        {{ group.title }}
      </button>
    </UiFlex>

    <div>
      <UiField label="Фильтр по названию упражнения">
        <UiInput v-model="muscleGroupTitle" data-test="exercise-muscle-group-title" />
      </UiField>
    </div>

    <UiFlex column>
      <UiSpoiler
        v-model="exerciseSpoilers[index]"
        :title="exercise.title"
        v-for="(exercise, index) in filteredExercises"
        :key="exercise._id"
        data-test="exercise-muscle-group-spoiler"
      >
        <ExerciseChooseElement
          :exercise="exercise"
          @add="(choosenExercise) => emit('choose', choosenExercise)"
          data-test="exercise-choose-element"
        />
      </UiSpoiler>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IExercise, EXERCISE_MUSCLE_GROUPS } from 'fitness-tracker-contracts';
import { UiField, UiFlex, UiInput, UiSpoiler } from 'mhz-ui';

import ExerciseChooseElement from './ExerciseChooseElement.vue';

interface IProps {
  exercises: IExercise[];
}

const props = defineProps<IProps>();
const emit = defineEmits(['choose']);

const exerciseSpoilers = ref([]);

const currentMuscleGroup = ref('');

const muscleGroupTitle = ref('');

const muscleGroups = computed(() => [{ _id: '', title: 'Все' }, ...EXERCISE_MUSCLE_GROUPS]);

const filteredExercises = computed(() =>
  props.exercises.filter((exercise) => {
    const titleFilter = exercise.title.toLowerCase().includes(muscleGroupTitle.value.toLocaleLowerCase());
    const muscleGroupFilter = exercise.muscleGroups?.some((group) => group._id === currentMuscleGroup.value);

    return currentMuscleGroup.value ? muscleGroupFilter && titleFilter : titleFilter;
  })
);

function setCurrentGroup(id: string) {
  currentMuscleGroup.value = id;
  exerciseSpoilers.value = [];
}
</script>

<style module lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 320px;
  height: 64dvh;
  overflow: auto;
}

.button {
  padding: 4px 1px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-dark-extra);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;

  &[data-current='true'] {
    color: var(--color-primary);
  }
}
</style>
