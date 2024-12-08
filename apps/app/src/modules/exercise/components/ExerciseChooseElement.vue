<template>
  <div>
    <UiFlex column gap="16">
      <UiField v-if="!isNoWeights" label="Вес гантелей, кг.">
        <UiSelect v-model="choosenExercise.weight" :options="weightOptions" lang="ru" />
      </UiField>

      <ExerciseRepeatsChoice v-model="choosenExercise.repeats" :options="EXERCISE_REPEATS_OPTIONS" title="Повторы" />

      <UiFlex justify="space-between">
        <UiButton @click="addExercise(1)">Добавить</UiButton>

        <UiFlex>
          <UiButton @click="addExercise(2)" layout="secondary" isNarrow>+2</UiButton>
          <UiButton @click="addExercise(3)" layout="secondary" isNarrow>+3</UiButton>
        </UiFlex>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { IExercise } from 'fitness-tracker-contracts';
import { UiButton, UiField, UiFlex, UiSelect } from 'mhz-ui';
import { createTempId } from 'mhz-helpers';

import ExerciseRepeatsChoice from '@/exercise/components/ExerciseRepeatsChoice.vue';

import { EXERCISE_REPEATS_OPTIONS } from '@/exercise/constants';

interface IProps {
  exercise: IExercise;
}

const props = defineProps<IProps>();
const emit = defineEmits(['add']);

const choosenExercise = ref({
  repeats: 12,
  weight: 0,
});

const weightOptions = computed(() => {
  const weights = props.exercise.weights?.length ? [...props.exercise.weights] : [];

  return weights.sort((a, b) => a - b);
});

const isNoWeights = computed(
  () => !props.exercise.weights?.length || (props.exercise.weights?.length === 1 && props.exercise.weights.includes(0))
);

function addExercise(count: number) {
  for (let i = 0; i < count; i++) {
    emit('add', {
      _id: createTempId(),
      exercise: { _id: props.exercise?._id, title: props.exercise?.title },
      ...choosenExercise.value,
    });
  }
}

onMounted(() => {
  if (props.exercise.defaultWeight) choosenExercise.value.weight = props.exercise.defaultWeight;
});
</script>
