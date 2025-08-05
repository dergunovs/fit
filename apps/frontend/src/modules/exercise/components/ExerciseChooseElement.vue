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

      <ExerciseRepeatsChoice
        v-model="choosenExercise.repeats"
        :options="EXERCISE_REPEATS_OPTIONS"
        :title="t('repeat.many')"
        data-test="exercise-repeats"
      />

      <UiFlex justify="space-between">
        <UiButton @click="addExercise(1)" data-test="exercise-add-1">{{ t('add') }}</UiButton>

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
import { useI18n } from 'vue-i18n';
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

interface IEmit {
  add: [choosenExercise: IExerciseChoosen];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useI18n();

const choosenExercise = ref({
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: getDefaultExerciseWeight(props.exercise, props.user, props.weights),
});

function addExercise(count: number) {
  for (let i = 0; i < count; i++) {
    const exercise = {
      _id: props.exercise?._id,
      title: props.exercise?.title,
      title_en: props.exercise?.title_en,
      isWeights: props.exercise?.isWeights,
      isWeightsRequired: props.exercise?.isWeightsRequired,
    };

    emit('add', { _id: createTempId(), exercise, ...choosenExercise.value });
  }
}
</script>
