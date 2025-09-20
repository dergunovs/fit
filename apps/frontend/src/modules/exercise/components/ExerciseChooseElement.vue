<template>
  <div>
    <UiFlex column gap="16">
      <ExerciseWeight
        v-if="props.exercise.isWeights && options.length > 0"
        v-model="choosenExercise.weight"
        :options="options"
        data-test="exercise-choosen-weight"
      />

      <ExerciseRepeats v-model="choosenExercise.repeats" data-test="exercise-choosen-repeats" />

      <UiFlex justify="space-between">
        <UiButton @click="addExercises(1)" data-test="exercise-add-1">{{ t('add') }}</UiButton>

        <UiFlex>
          <UiButton @click="addExercises(2)" layout="secondary" isNarrow data-test="exercise-add-2">+2</UiButton>
          <UiButton @click="addExercises(3)" layout="secondary" isNarrow data-test="exercise-add-3">+3</UiButton>
        </UiFlex>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IExercise, IExerciseChoosen, IUser } from 'fitness-tracker-contracts';
import { UiButton, UiFlex } from 'mhz-ui';

import ExerciseWeight from '@/exercise/components/ExerciseWeight.vue';
import ExerciseRepeats from '@/exercise/components/ExerciseRepeats.vue';

import { EXERCISE_REPEATS_DEFAULT } from '@/exercise/constants';
import { getDefaultExerciseWeight, getAvailableExerciseWeights, generateExerciseChoosen } from '@/exercise/helpers';
import { useTI18n } from '@/common/composables';

interface IProps {
  exercise: IExercise;
  user: IUser;
}

interface IEmit {
  add: [choosenExercises: IExerciseChoosen[]];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t } = useTI18n();

const options = computed(() => getAvailableExerciseWeights(props.exercise, props.user));

const choosenExercise = ref({
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: getDefaultExerciseWeight(props.exercise, props.user, options.value),
});

function addExercises(count: number) {
  const exercises = [];

  for (let i = 0; i < count; i++) {
    const exercise = generateExerciseChoosen(
      choosenExercise.value.repeats,
      choosenExercise.value.weight,
      props.exercise
    );

    exercises.push(exercise);
  }

  emit('add', exercises);
}
</script>
