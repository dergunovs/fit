<template>
  <UiFlex column>
    <h3>{{ t('exercise.many') }}</h3>

    <TransitionGroup name="list" tag="div" :class="$style.block">
      <ExerciseChoosenElement
        v-for="(exercise, index) in props.choosenExercises"
        :key="exercise._id"
        :exercise="exercise"
        :index="index"
        :isLast="index === props.choosenExercises.length - 1"
        :isSetCreatable="isSetCreatable(props.choosenExercises, index, exercise.exercise?._id)"
        @delete="(id) => emit('delete', id)"
        @createSet="emit('createSet')"
        @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
        data-test="exercise-choosen"
      />
    </TransitionGroup>
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import ExerciseChoosenElement from '@/exercise/components/ExerciseChoosenElement.vue';

import { isSetCreatable } from '@/exercise/helpers';
import { useTI18n } from '@/common/composables';

interface IProps {
  choosenExercises: IExerciseChoosen[];
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
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
  transition: all 300ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-active {
  position: absolute;
}
</style>
