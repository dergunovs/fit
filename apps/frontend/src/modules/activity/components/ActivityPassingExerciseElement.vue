<template>
  <div
    v-if="!props.exercise.isDone"
    :class="$style.element"
    :data-current="props.isCurrentExercise"
    :data-active="isCurrentExerciseActive"
  >
    <div :class="$style.title" :data-current="props.isCurrentExercise">
      {{ exerciseTitle }}
    </div>

    <template v-if="props.isCurrentExercise">
      <UiButton @click="handleClick" :isDisabled="isButtonDisabled" isTall>
        {{ buttonTitle }}
      </UiButton>

      <UiCheckbox v-model="isToFailure" label="Упражнение выполнено до отказа" :isDisabled="!isCurrentExerciseActive" />

      <ExerciseRepeatsChoice v-model="repeats" :options="repeatsOptions" title="Количество повторов" isTall />

      <ActivityDuration :start="start" :stop="stop" @stop="sendDurationData" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { UiButton, UiCheckbox } from 'mhz-ui';
import { IExerciseDone } from 'fitness-tracker-contracts';

import ActivityDuration from '@/activity/components/ActivityDuration.vue';
import ExerciseRepeatsChoice from '@/exercise/components/ExerciseRepeatsChoice.vue';

interface IProps {
  exercise: IExerciseDone;
  activeExerciseId?: string;
  isCurrentExercise: boolean;
  index: number;
  exercisesCount: number;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ start: [id: string]; stop: [exerciseDone: IExerciseDone] }>();

const start = ref(false);
const stop = ref(false);

const isToFailure = ref(false);
const repeats = ref(props.exercise.repeats);

const isCurrentExerciseActive = computed(() => props.exercise._id === props.activeExerciseId);

const isButtonDisabled = ref(false);

const repeatsOptions = [
  props.exercise.repeats - 2,
  props.exercise.repeats - 1,
  props.exercise.repeats,
  props.exercise.repeats + 1,
  props.exercise.repeats + 2,
];

const exerciseTitle = computed(
  () => `
    ${props.index}${props.isCurrentExercise ? ` из ${props.exercisesCount}.` : `.`}
    ${props.exercise.exercise?.title || 'Упражнение удалено'}${props.exercise.weight ? ` ${props.exercise.weight} кг.` : `.`}
  `
);

const buttonTitle = computed(() => (isCurrentExerciseActive.value ? 'Завершить' : 'Начать'));

watch(
  () => props.isCurrentExercise,
  () => {
    if (props.isCurrentExercise) {
      isButtonDisabled.value = true;

      setTimeout(() => {
        isButtonDisabled.value = false;
      }, 1000);
    }
  }
);

function handleClick() {
  if (!props.exercise._id) return;

  isButtonDisabled.value = true;

  emit('start', props.exercise._id);
  start.value = !isCurrentExerciseActive.value;
  stop.value = isCurrentExerciseActive.value;

  setTimeout(() => {
    isButtonDisabled.value = false;
  }, 1000);
}

function sendDurationData(duration: number) {
  if (isCurrentExerciseActive.value) {
    emit('stop', { _id: props.exercise._id, duration, isToFailure: isToFailure.value, repeats: repeats.value });
  }
}
</script>

<style module lang="scss">
.element {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &[data-current='true'] {
    padding: 8px 0;
    border-top: 16px solid var(--color-gray);
    border-bottom: 16px solid var(--color-gray);
  }

  &[data-active='true'] {
    border-color: var(--color-accent);
  }
}

.title {
  display: flex;
  gap: 4px;
  align-items: center;
  color: var(--color-gray-dark-extra);

  &[data-current='true'] {
    font-weight: 700;
    color: var(--color-black);
  }
}
</style>
