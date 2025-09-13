<template>
  <div :class="$style.exercise">
    <UiFlex column gap="2" align="flex-start">
      <div data-test="exercise-choosen-title">
        {{ `${props.index + 1}. ${props.exercise.exercise?.[localeField('title', locale)]}` }}
      </div>

      <ExerciseChoosenButtons
        v-if="props.exercise._id"
        :repeats="props.exercise.repeats"
        :weight="props.exercise.weight"
        :index="props.index"
        :isLast="props.isLast"
        :isSetCreatable="props.isSetCreatable"
        @createSet="emit('createSet')"
        @delete="emit('delete', props.exercise._id)"
        @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
        data-test="exercise-choosen-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { IExerciseChoosen } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';
import { localeField } from 'mhz-helpers';

import ExerciseChoosenButtons from '@/exercise/components/ExerciseChoosenButtons.vue';

import { useTI18n } from '@/common/composables';

interface IProps {
  exercise: IExerciseChoosen;
  index: number;
  isSetCreatable: boolean;
  isLast: boolean;
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { locale } = useTI18n();
</script>

<style module lang="scss">
.exercise {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 6px 10px;
  background-color: var(--color-gray-light);
  border-bottom: 1px solid var(--color-gray);
  border-radius: 12px;
}
</style>
