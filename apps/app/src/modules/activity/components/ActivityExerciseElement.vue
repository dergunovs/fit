<template>
  <div
    v-if="!props.exercise.isDone"
    :class="$style.element"
    :data-current="props.isCurrentExercise"
    :data-active="isCurrentExerciseActive"
  >
    <div :class="$style.title" :data-current="props.isCurrentExercise">
      {{ props.index }}<template v-if="props.isCurrentExercise">{{ ` из ${props.exercisesCount}` }}</template
      >.
      {{ props.exercise.exercise?.title || 'Упражнение удалено' }}

      <template v-if="props.exercise.weight">{{ props.exercise.weight }} кг.</template>
    </div>

    <template v-if="props.isCurrentExercise">
      <UiButton @click="handleClick" :isDisabled="isButtonDisabled" isTall>
        {{ buttonTitle }}
      </UiButton>

      <UiCheckbox v-model="isToFailure" label="Упражнение выполнено до отказа" :isDisabled="!isCurrentExerciseActive" />

      <div>
        <div :class="$style.repeats">Количество повторов</div>

        <UiFlex justify="space-between">
          <UiButton
            v-for="repeat in repeatButtons"
            :key="repeat"
            @click="repeats = repeat"
            :layout="repeat === repeats ? 'accent' : 'primary'"
            isNarrow
            isTall
            :isDisabled="!isCurrentExerciseActive"
          >
            {{ repeat }}
          </UiButton>
        </UiFlex>
      </div>

      <ActivityDuration :duration="exercise.duration" :start="start" :stop="stop" @stop="sendDurationData" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { UiButton, UiCheckbox, UiFlex } from 'mhz-ui';
import { IExerciseDone } from 'fitness-tracker-contracts';

import ActivityDuration from '@/activity/components/ActivityDuration.vue';

interface IProps {
  exercise: IExerciseDone;
  activeExerciseId?: string;
  isActivityDone: boolean;
  isCurrentExercise: boolean;
  index: number;
  exercisesCount: number;
}

const props = defineProps<IProps>();
const emit = defineEmits(['start', 'stop']);

const start = ref(false);
const stop = ref(false);

const isToFailure = ref(false);
const repeats = ref(props.exercise.repeats);

const isCurrentExerciseActive = computed(() => props.exercise._id === props.activeExerciseId);

const isButtonDisabled = computed(
  () => props.isActivityDone || props.exercise.isDone || (!isCurrentExerciseActive.value && !!props.activeExerciseId)
);

const repeatButtons = [
  props.exercise.repeats - 2,
  props.exercise.repeats - 1,
  props.exercise.repeats,
  props.exercise.repeats + 1,
  props.exercise.repeats + 2,
];

const buttonTitle = computed(() => (isCurrentExerciseActive.value ? 'Завершить' : 'Начать'));

function handleClick() {
  emit('start', props.exercise._id);
  start.value = !isCurrentExerciseActive.value;
  stop.value = isCurrentExerciseActive.value;
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
    border-top: 8px solid var(--color-gray);
    border-bottom: 8px solid var(--color-gray);
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

.repeats {
  text-align: center;
}
</style>
