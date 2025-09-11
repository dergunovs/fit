<template>
  <div>
    <UiFlex column gap="16">
      <UiField v-if="props.exercise.isWeights && props.weights?.length" :label="`${t('weight')}, ${t('kg')}`">
        <UiSelect
          v-model="choosenExercise.weight"
          :options="props.weights"
          :lang="locale"
          data-test="exercise-weight"
        />
      </UiField>

      <UiButtongroup
        v-model="choosenExercise.repeats"
        :options="EXERCISE_REPEATS_OPTIONS"
        :title="t('repeat.many')"
        isInput
        data-test="exercise-repeats"
      />

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
import { ref } from 'vue';
import { IExercise, IExerciseChoosen, IUser } from 'fitness-tracker-contracts';
import { UiButton, UiButtongroup, UiField, UiFlex, UiSelect } from 'mhz-ui';
import { createTempId } from 'mhz-helpers';

import { EXERCISE_REPEATS_DEFAULT, EXERCISE_REPEATS_OPTIONS } from '@/exercise/constants';
import { getDefaultExerciseWeight } from '@/exercise/helpers';
import { useTI18n } from '@/common/composables';

interface IProps {
  exercise: IExercise;
  user: IUser;
  weights?: number[];
}

interface IEmit {
  add: [choosenExercises: IExerciseChoosen[]];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useTI18n();

const choosenExercise = ref({
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: getDefaultExerciseWeight(props.exercise, props.user, props.weights),
});

function addExercises(count: number) {
  const exercises = [];

  for (let i = 0; i < count; i++) {
    const exercise = {
      _id: props.exercise?._id,
      title: props.exercise?.title,
      title_en: props.exercise?.title_en,
      isWeights: props.exercise?.isWeights,
      isWeightsRequired: props.exercise?.isWeightsRequired,
    };

    exercises.push({ _id: createTempId(), exercise, ...choosenExercise.value });
  }

  emit('add', exercises);
}
</script>
