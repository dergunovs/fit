<template>
  <div
    v-show="!props.isPassing || (props.isPassing && !props.isDone)"
    :class="$style.exercise"
    :data-hide="props.isHideTitle"
    :data-edit="props.isEdit"
  >
    <ExerciseMuscleColors
      v-if="props.exercise.exercise?.muscles && !props.isHideTitle"
      :muscles="props.exercise.exercise.muscles"
      data-test="exercise-muscle-colors"
    />

    <UiFlex column :gap="props.isEdit ? '4' : '2'" align="flex-start" grow>
      <ExerciseElementTitle
        v-if="!props.isHideTitle"
        :exercise="props.exercise.exercise"
        :exercisesCount="props.exercisesCount"
        :index="props.index"
        :isEdit="props.isEdit"
        :isPassing="props.isPassing"
        :isCurrent="props.isCurrent"
        data-test="exercise-element-title"
      />

      <ExerciseButtons
        v-if="props.exercise._id"
        :isEdit="props.isEdit"
        :isPassing="props.isPassing"
        :repeats="props.exercise.repeats"
        :weight="props.exercise.weight"
        :index="props.index"
        :isLast="props.isLast"
        :isSetCreatable="props.isSetCreatable"
        :isDone="props.isDone"
        :isToFailure="props.isToFailure"
        :duration="props.duration"
        :isFutureActivity="props.isFutureActivity"
        :isWeights="props.exercise.exercise?.isWeights"
        :isCurrent="props.isCurrent"
        :isActive="props.isActive"
        :isOnlyOne="props.exercisesCount === 1 && props.exercisesCount === index + 1"
        @createSet="emit('createSet')"
        @delete="emit('delete', props.exercise._id)"
        @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
        @editRepeats="toggleExerciseRepeats"
        @editWeight="toggleExerciseWeight"
        @setIsToFailure="(isToFailure) => emit('setIsToFailure', isToFailure)"
        data-test="exercise-buttons"
      />

      <Transition name="slide" mode="out-in">
        <ExerciseRepeats
          v-show="isShowEditRepeats"
          :modelValue="props.exercise.repeats"
          :baseRepeat="props.exercise.repeats"
          isTall
          @update:modelValue="updateRepeats"
          data-test="exercise-repeats"
        />
      </Transition>

      <Transition name="slide" mode="out-in">
        <ExerciseWeight
          v-if="props.exercise.exercise && user"
          v-show="isShowEditWeight"
          @update:modelValue="updateWeight"
          :modelValue="props.exercise.weight"
          :options="getAvailableExerciseWeights(props.exercise.exercise, user)"
          data-test="exercise-weight"
        />
      </Transition>

      <slot></slot>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IExerciseChoosen } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';

import ExerciseElementTitle from '@/exercise/components/ExerciseElementTitle.vue';
import ExerciseMuscleColors from '@/exercise/components/ExerciseMuscleColors.vue';
import ExerciseRepeats from '@/exercise/components/ExerciseRepeats.vue';
import ExerciseWeight from '@/exercise/components/ExerciseWeight.vue';
import ExerciseButtons from '@/exercise/components/ExerciseButtons.vue';

import { getAvailableExerciseWeights } from '@/exercise/helpers';
import { useAuthCheck } from '@/auth/composables';

interface IProps {
  exercise: IExerciseChoosen;
  index: number;
  isEdit?: boolean;
  isPassing?: boolean;
  isSetCreatable?: boolean;
  isLast?: boolean;
  isHideTitle?: boolean;
  isDone?: boolean;
  isToFailure?: boolean;
  isActive?: boolean;
  isCurrent?: boolean;
  duration?: number;
  isFutureActivity?: boolean;
  exercisesCount?: number;
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
  setRepeats: [repeats: number];
  setWeight: [weight: number];
  setIsToFailure: [isToFailure: boolean];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { user } = useAuthCheck();

const isShowEditRepeats = ref(false);
const isShowEditWeight = ref(false);

function toggleExerciseRepeats() {
  isShowEditRepeats.value = !isShowEditRepeats.value;
  isShowEditWeight.value = false;
}

function toggleExerciseWeight() {
  isShowEditWeight.value = !isShowEditWeight.value;
  isShowEditRepeats.value = false;
}

function updateRepeats(repeats: number) {
  emit('setRepeats', repeats);

  toggleExerciseRepeats();
}

function updateWeight(weight: number) {
  emit('setWeight', weight);

  toggleExerciseWeight();
}
</script>

<style module lang="scss">
.exercise {
  position: relative;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: var(--color-gray-light-extra);
  border-bottom: 1px solid var(--color-gray);
  border-radius: 8px;

  &[data-edit='true'] {
    padding: 8px 12px;
  }

  &[data-hide='true'] {
    margin-top: -14px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}

:global(.dark) {
  .exercise {
    background-color: var(--color-black);
    border: 1px solid var(--color-gray-dark-extra);

    &[data-hide='true'] {
      border-top: none;
    }
  }
}
</style>

<style lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: all 200ms ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
