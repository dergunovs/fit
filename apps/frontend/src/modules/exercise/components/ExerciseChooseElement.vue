<template>
  <div>
    <UiFlex column gap="16">
      <UiField v-if="props.exercise.isWeights && props.weights?.length" label="Вес, кг.">
        <UiSelect v-model="choosenExercise.weight" :options="props.weights" lang="ru" data-test="exercise-weight" />
      </UiField>

      <ExerciseRepeatsChoice
        v-model="choosenExercise.repeats"
        :options="EXERCISE_REPEATS_OPTIONS"
        title="Повторы"
        data-test="exercise-repeats"
      />

      <UiFlex justify="space-between">
        <UiButton @click="addExercise(1)" data-test="exercise-add-1">Добавить</UiButton>

        <UiFlex>
          <UiButton @click="addExercise(2)" layout="secondary" isNarrow data-test="exercise-add-2">+2</UiButton>
          <UiButton @click="addExercise(3)" layout="secondary" isNarrow data-test="exercise-add-3">+3</UiButton>
        </UiFlex>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IExercise, IExerciseChoosen, IUser } from 'fitness-tracker-contracts';
import { UiButton, UiField, UiFlex, UiSelect } from 'mhz-ui';
import { createTempId } from 'mhz-helpers';

import ExerciseRepeatsChoice from '@/exercise/components/ExerciseRepeatsChoice.vue';

import { EXERCISE_REPEATS_DEFAULT, EXERCISE_REPEATS_OPTIONS } from '@/exercise/constants';
import { getDefaultExerciseWeight } from '@/exercise/helpers';

interface IProps {
  exercise: IExercise;
  user: IUser;
  weights?: number[];
}

const props = defineProps<IProps>();
const emit = defineEmits<{ add: [choosenExercise: IExerciseChoosen] }>();

const choosenExercise = ref({
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: getDefaultExerciseWeight(props.exercise, props.user, props.weights),
});

function addExercise(count: number) {
  for (let i = 0; i < count; i++) {
    const exercise = {
      _id: props.exercise?._id,
      title: props.exercise?.title,
      isWeights: props.exercise?.isWeights,
      isWeightsRequired: props.exercise?.isWeightsRequired,
    };

    emit('add', { _id: createTempId(), exercise, ...choosenExercise.value });
  }
}
</script>
