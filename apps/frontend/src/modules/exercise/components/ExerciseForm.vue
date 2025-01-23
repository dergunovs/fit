<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="exercise-form">
      <UiField label="Название" isRequired :error="error('title')">
        <UiInput v-model="formData.title" data-test="exercise-form-title" />
      </UiField>

      <UiField label="Описание">
        <UiEditor v-model="formData.description" data-test="exercise-form-description" />
      </UiField>

      <UiCheckbox v-model="formData.isWeights" label="Наличие веса" data-test="exercise-form-is-weights" />

      <UiCheckbox
        v-if="formData.isWeights"
        v-model="formData.isWeightsRequired"
        label="Обязательность веса"
        data-test="exercise-form-is-weights-required"
      />

      <UiField label="Используемое оборудование">
        <UiSelect v-model="formData.equipment" :options="filterEquipmentByWeights(equipments)" isClearable lang="ru" />
      </UiField>

      <UiFlex v-if="formData.isWeights" column>
        <div>Возможное оборудование для веса</div>

        <UiCheckbox
          v-for="equipment in filterEquipmentByWeights(equipments, true)"
          :key="equipment.title"
          :modelValue="choosenEquipmentForWeight.some((eq) => equipment.title === eq.title)"
          @update:modelValue="updateEquipment(equipment, !!$event)"
          :label="equipment.title"
          data-test="exercise-form-equipment-for-weight"
        />
      </UiFlex>

      <UiFlex column>
        <div>Задействованные мышцы</div>

        <UiCheckbox
          v-for="muscleGroup in EXERCISE_MUSCLE_GROUPS"
          :key="muscleGroup._id"
          :modelValue="choosenMuscleGroups.some((group) => group._id === muscleGroup._id)"
          @update:modelValue="updateMuscleGroups(muscleGroup, !!$event)"
          :label="muscleGroup.title"
          data-test="exercise-form-muscle-groups"
        />
      </UiFlex>

      <FormButtons
        :id="props.exercise?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        @delete="(id) => mutateDelete(id)"
        data-test="exercise-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UiField, UiInput, UiCheckbox, toast, UiSelect, UiFlex, UiEditor } from 'mhz-ui';
import { useQueryClient, useValidator, required, clone } from 'mhz-helpers';
import {
  API_EXERCISE,
  IExercise,
  IMuscleGroup,
  EXERCISE_MUSCLE_GROUPS,
  IEquipment,
  API_ACTIVITY_STATISTICS,
} from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';

import { URL_EXERCISE } from '@/exercise/constants';
import { exerciseService } from '@/exercise/services';
import { equipmentService } from '@/equipment/services';
import { filterEquipmentByWeights } from '@/equipment/helpers';

interface IProps {
  exercise?: IExercise;
}

const props = defineProps<IProps>();

const queryClient = useQueryClient();

const router = useRouter();

const formData = ref<IExercise>({
  title: '',
  description: '',
  muscleGroups: [],
  isWeights: false,
  isWeightsRequired: false,
  equipment: undefined,
  equipmentForWeight: [],
});

const choosenMuscleGroups = ref<IMuscleGroup[]>([]);
const choosenEquipmentForWeight = ref<IEquipment[]>([]);

const { data: equipments } = equipmentService.getAll();

function updateMuscleGroups(muscleGroup: IMuscleGroup, isChecked: boolean) {
  choosenMuscleGroups.value = isChecked
    ? [...choosenMuscleGroups.value, muscleGroup]
    : choosenMuscleGroups.value.filter((current) => current._id !== muscleGroup._id);

  formData.value.muscleGroups = [...choosenMuscleGroups.value];
}

function updateEquipment(equipment: IEquipment, isChecked: boolean) {
  choosenEquipmentForWeight.value = isChecked
    ? [...choosenEquipmentForWeight.value, equipment]
    : choosenEquipmentForWeight.value.filter((current) => current.title !== equipment.title);

  formData.value.equipmentForWeight = [...choosenEquipmentForWeight.value];
}

const { mutate: mutatePost, isPending: isLoadingPost } = exerciseService.create({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    toast.success('Упражнение добавлено');
    router.push(URL_EXERCISE);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = exerciseService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    toast.success('Упражнение обновлено');
  },
});

const { mutate: mutateDelete } = exerciseService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_EXERCISE] });
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    toast.success('Упражнение удалено');
    router.push(URL_EXERCISE);
  },
});

const rules = computed(() => {
  return {
    title: required('ru'),
  };
});

const { error, isValid } = useValidator(formData, rules);

function submit() {
  if (!isValid()) return;

  if (props.exercise?._id) {
    mutateUpdate(formData.value);
  } else {
    mutatePost(formData.value);
  }
}

onMounted(() => {
  if (props.exercise) {
    formData.value = clone(props.exercise);

    if (formData.value.muscleGroups?.length) choosenMuscleGroups.value = [...formData.value.muscleGroups];
    if (formData.value.equipmentForWeight?.length)
      choosenEquipmentForWeight.value = [...formData.value.equipmentForWeight];
  }
});
</script>
