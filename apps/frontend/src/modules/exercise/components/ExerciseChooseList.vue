<template>
  <div :class="$style.list">
    <UiFlex gap="4">
      <button
        v-for="muscle in muscleFilters"
        :key="muscle._id"
        @click="setCurrentMuscle(muscle._id)"
        type="button"
        :class="$style.button"
        :data-current="muscle._id === currentMuscle"
        data-test="muscle"
      >
        {{ muscle.title }}
      </button>
    </UiFlex>

    <div>
      <UiField label="Фильтр по названию упражнения">
        <UiInput v-model="title" data-test="muscle-title" />
      </UiField>
    </div>

    <UiFlex column>
      <UiSpoiler
        v-model="exerciseSpoilers[index]"
        :title="exercise.title"
        v-for="(exercise, index) in filterExercisesByTitleAndMuscle(props.exercises, title, currentMuscle, user)"
        :key="exercise._id"
        data-test="muscle-spoiler"
      >
        <ExerciseChooseElement
          v-if="user"
          :exercise="exercise"
          :weights="getAvailableExerciseWeights(exercise, user)"
          :user="user"
          @add="(choosenExercise) => emit('choose', choosenExercise)"
          data-test="exercise-choose-element"
        />
      </UiSpoiler>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IExercise, IExerciseChoosen } from 'fitness-tracker-contracts';
import { UiField, UiFlex, UiInput, UiSpoiler } from 'mhz-ui';

import ExerciseChooseElement from '@/exercise/components/ExerciseChooseElement.vue';

import { useAuthCheck } from '@/auth/composables';
import { muscleService } from '@/muscle/services';
import { filterExercisesByTitleAndMuscle, getAvailableExerciseWeights } from '@/exercise/helpers';

interface IProps {
  exercises: IExercise[];
}

const props = defineProps<IProps>();
const emit = defineEmits<{ choose: [choosenExercise: IExerciseChoosen] }>();

const { user } = useAuthCheck();

const exerciseSpoilers = ref([]);

const currentMuscle = ref<string>('');
const title = ref('');

const { data: muscles } = muscleService.getAll();

const muscleFilters = computed(() => [{ _id: '', title: 'Все' }, ...(muscles.value || [])]);

function setCurrentMuscle(id?: string) {
  currentMuscle.value = id || '';
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
