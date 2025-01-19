<template>
  <UiFlex column>
    <UiFlex
      v-for="exercise in getExercisesToChooseDefaultWeight(props.exercises, props.userEquipments)"
      :key="exercise._id"
      column
      data-test="user-default-weight"
    >
      <div data-test="user-default-weight-title">{{ exercise.title }}</div>

      <UiSelect
        v-if="exercise._id"
        :modelValue="props.modelValue?.[exercise._id]"
        :options="exercise.options"
        @update:modelValue="(value) => updateWeights(Number(value), exercise._id)"
        lang="ru"
        data-test="user-default-weight-select"
      />
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { IExercise, IUserDefaultWeights, IUserEquipment } from 'fitness-tracker-contracts';
import { UiFlex, UiSelect } from 'mhz-ui';

import { getExercisesToChooseDefaultWeight } from '@/exercise/helpers';

interface IProps {
  userEquipments: IUserEquipment[];
  exercises: IExercise[];
  modelValue?: IUserDefaultWeights;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ 'update:modelValue': [value?: IUserDefaultWeights] }>();

function updateWeights(weight: number, id?: string) {
  if (!id) return;

  const weightsToUpdate = props.modelValue ? { ...props.modelValue, [id]: weight } : { [id]: weight };

  emit('update:modelValue', weightsToUpdate);
}
</script>
