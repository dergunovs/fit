<template>
  <UiFlex column>
    <h3>{{ t('exercise.many') }}</h3>

    <TransitionGroup name="list" tag="div" :class="$style.block">
      <ExerciseElement
        v-for="(exercise, index) in props.choosenExercises"
        :key="exercise._id"
        :exercise="exercise"
        isEdit
        :index="index"
        :isLast="index === props.choosenExercises.length - 1"
        :isSetCreatable="isSetCreatable(props.choosenExercises, index, exercise.exercise?._id)"
        @delete="(id) => emit('delete', id)"
        @createSet="emit('createSet')"
        @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
        @setRepeats="(repeats) => emit('setRepeats', repeats, exercise._id)"
        @setWeight="(weight) => emit('setWeight', weight, exercise._id)"
        data-test="exercise-choosen-element"
      />
    </TransitionGroup>
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import ExerciseElement from '@/exercise/components/ExerciseElement.vue';

import { isSetCreatable } from '@/exercise/helpers';
import { useTI18n } from '@/common/composables';

interface IProps {
  choosenExercises: IExerciseChoosen[];
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
  setRepeats: [repeats: number, id?: string];
  setWeight: [weight: number, id?: string];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t } = useTI18n();
</script>

<style module lang="scss">
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

<style lang="scss">
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 200ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-leave-active {
  position: absolute;
}
</style>
