<template>
  <div>
    <UiFlex column>
      <TransitionGroup name="list" tag="div" :class="$style.block">
        <ExerciseElement
          v-for="(exercise, index) in props.exercises as IExerciseDone[]"
          :key="exercise._id"
          :exercise="exercise"
          :exercisesCount="props.exercises.length"
          :index="index"
          :isLast="index === props.exercises.length - 1"
          :isSetCreatable="isSetCreatable(props.exercises, index, exercise.exercise?._id)"
          :isEdit="props.isEdit"
          :isDone="exercise.isDone"
          :isPassing="props.isPassing"
          :duration="exercise.duration"
          :isFutureActivity="props.isFutureActivity"
          :isToFailure="exercise.isToFailure"
          :isHideTitle="
            isPrevExerciseSame(props.exercises, index, exercise.exercise?._id) && !props.isEdit && !props.isPassing
          "
          :isActive="exercise._id === props.activeExerciseId"
          :isCurrent="index === props.currentExerciseIndex"
          @delete="(id) => emit('delete', id)"
          @createSet="emit('createSet')"
          @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
          @setRepeats="(repeats) => emit('setRepeats', repeats, exercise._id)"
          @setWeight="(weight) => emit('setWeight', weight, exercise._id)"
          @setIsToFailure="(isToFailure) => emit('setIsToFailure', isToFailure, exercise._id)"
          data-test="exercise-element"
        >
          <slot :exercise="exercise" :index="index"></slot>
        </ExerciseElement>
      </TransitionGroup>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { IExerciseChoosen, IExerciseDone } from 'fitness-tracker-contracts';

import ExerciseElement from '@/exercise/components/ExerciseElement.vue';

import { isSetCreatable, isPrevExerciseSame } from '@/exercise/helpers';

interface IProps {
  exercises: IExerciseChoosen[] | IExerciseDone[];
  isEdit?: boolean;
  isPassing?: boolean;
  isFutureActivity?: boolean;
  currentExerciseIndex?: number;
  activeExerciseId?: string;
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
  setRepeats: [repeats: number, id?: string];
  setWeight: [weight: number, id?: string];
  setIsToFailure: [isToFailure: boolean, id?: string];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();
</script>

<style module lang="scss">
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
