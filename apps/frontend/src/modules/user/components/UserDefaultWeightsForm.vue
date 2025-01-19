<template>
  <div>
    <h3>Вес в упражнениях по-умолчанию</h3>

    <UiFlex column>
      <UiFlex
        v-for="exercise in exercisesToChooseWeight"
        :key="exercise._id"
        column
        data-test="user-default-weight-table-row"
      >
        <div>{{ exercise.title }}</div>

        <UiSelect
          v-if="exercise._id"
          :modelValue="props.modelValue?.[exercise._id]"
          :options="exercise.options"
          @update:modelValue="(value) => updateWeights(Number(value), exercise._id)"
          lang="ru"
        />
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IExercise, IUserDefaultWeights, IUserEquipment } from 'fitness-tracker-contracts';
import { UiFlex, UiSelect } from 'mhz-ui';

import { getWeightsForUserEquipment } from '@/equipment/helpers';

interface IProps {
  userEquipments: IUserEquipment[];
  exercises: IExercise[];
  modelValue?: IUserDefaultWeights;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ 'update:modelValue': [value?: IUserDefaultWeights] }>();

const exercisesToChooseWeight = computed(() => {
  const equipmentsForWeight = props.userEquipments.filter((eq) => eq.weights?.length);
  const exercisesWithWeight = props.exercises.filter((ex) => ex.isWeights);

  const tableData = exercisesWithWeight.map((ex) => {
    const exerciseEquipment = ex.equipmentForWeight
      ?.filter((eq) => equipmentsForWeight.some((equipment) => equipment.equipment?.title === eq.title))
      .map((exToMap) => exToMap.title);

    const availableEqupment = equipmentsForWeight.filter((eq) =>
      exerciseEquipment?.some((equipmentTitle) => equipmentTitle === eq.equipment?.title)
    );

    const options = getWeightsForUserEquipment(availableEqupment);

    return { _id: ex._id, title: ex.title, options: ex.isWeightsRequired ? options : [0, ...options] };
  });

  return tableData.filter((ex) => ex.options.length > 1);
});

function updateWeights(weight: number, id?: string) {
  if (!id) return;

  if (props.modelValue) {
    const weightsToUpdate = { ...props.modelValue };

    weightsToUpdate[id] = weight;

    emit('update:modelValue', weightsToUpdate);
  } else {
    emit('update:modelValue', { [id]: weight });
  }
}
</script>
