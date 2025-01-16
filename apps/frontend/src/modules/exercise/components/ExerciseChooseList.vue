<template>
  <div :class="$style.list">
    <UiFlex gap="4">
      <button
        v-for="group in muscleGroups"
        :key="group._id"
        @click="setCurrentGroup(group._id)"
        type="button"
        :class="$style.button"
        :data-current="group._id === muscleGroup"
        data-test="exercise-muscle-group"
      >
        {{ group.title }}
      </button>
    </UiFlex>

    <div>
      <UiField label="Фильтр по названию упражнения">
        <UiInput v-model="title" data-test="exercise-muscle-group-title" />
      </UiField>
    </div>

    <UiFlex column>
      <UiSpoiler
        v-model="exerciseSpoilers[index]"
        :title="exercise.title"
        v-for="(exercise, index) in filterExercisesByTitleAndMuscleGroup(props.exercises, title, muscleGroup, user)"
        :key="exercise._id"
        data-test="exercise-muscle-group-spoiler"
      >
        <ExerciseChooseElement
          :exercise="exercise"
          :weights="getAvailableExerciseWeights(exercise, user)"
          @add="(choosenExercise) => emit('choose', choosenExercise)"
          data-test="exercise-choose-element"
        />
      </UiSpoiler>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IExercise, EXERCISE_MUSCLE_GROUPS, IExerciseChoosen } from 'fitness-tracker-contracts';
import { UiField, UiFlex, UiInput, UiSpoiler } from 'mhz-ui';

import ExerciseChooseElement from '@/exercise/components/ExerciseChooseElement.vue';

import { useAuthCheck } from '@/auth/composables';
import { filterExercisesByTitleAndMuscleGroup, getAvailableExerciseWeights } from '@/exercise/helpers';

interface IProps {
  exercises: IExercise[];
}

const props = defineProps<IProps>();
const emit = defineEmits<{ choose: [choosenExercise: IExerciseChoosen] }>();

const { user } = useAuthCheck();

const exerciseSpoilers = ref([]);

const muscleGroup = ref('');
const title = ref('');

const muscleGroups = computed(() => [{ _id: '', title: 'Все' }, ...EXERCISE_MUSCLE_GROUPS]);

function setCurrentGroup(id: string) {
  muscleGroup.value = id;
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
