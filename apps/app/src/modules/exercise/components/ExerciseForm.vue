<template>
  <div>
    <UiFlex @submit.prevent="props.exercise?._id ? update() : submit()" tag="form" column gap="24" align="flex-start">
      <UiField label="Название" isRequired :error="error('title')">
        <UiInput v-model="formData.title" />
      </UiField>

      <UiFlex column>
        <div>Возможный вес гантели</div>

        <UiCheckbox
          v-for="weight in EXERCISE_WEIGHT_OPTIONS"
          :key="weight"
          :modelValue="choosenWeights.some((choosen) => choosen === weight)"
          @update:modelValue="updateWeights(weight, $event)"
          :label="weight ? `${weight} кг.` : 'Без веса'"
        />
      </UiFlex>

      <UiFlex column>
        <div>Задействованные мышцы</div>

        <UiCheckbox
          v-for="muscleGroup in EXERCISE_MUSCLE_GROUPS"
          :key="muscleGroup._id"
          :modelValue="choosenMuscleGroups.some((group) => group._id === muscleGroup._id)"
          @update:modelValue="updateMuscleGroups(muscleGroup, $event)"
          :label="muscleGroup.title"
        />
      </UiFlex>

      <UiField label="Вес по-умолчанию" v-if="formData.weights?.length">
        <UiSelect v-model="formData.defaultWeight" :options="formData.weights.sort((a, b) => a - b)" lang="ru" />
      </UiField>

      <FormButtons :id="props.exercise?._id" :isLoading="isLoadingPost || isLoadingUpdate" @delete="handleDelete" />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UiField, UiInput, UiCheckbox, toast, UiSelect, UiFlex } from 'mhz-ui';
import { useQueryClient, useValidator, required, clone } from 'mhz-helpers';
import { API_EXERCISE, IExercise, IMuscleGroup, EXERCISE_MUSCLE_GROUPS } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';

import { URL_EXERCISE, EXERCISE_WEIGHT_OPTIONS } from '@/exercise/constants';
import { postExercise, updateExercise, deleteExercise } from '@/exercise/services';

interface IProps {
  exercise?: IExercise;
}

const props = defineProps<IProps>();

const queryClient = useQueryClient();

const router = useRouter();

const formData = ref<IExercise>({
  title: '',
  weights: [],
  muscleGroups: [],
  defaultWeight: undefined,
});

const choosenWeights = ref<number[]>([]);
const choosenMuscleGroups = ref<IMuscleGroup[]>([]);

function updateWeights(weight: number, isChecked: boolean) {
  choosenWeights.value = isChecked
    ? [...choosenWeights.value, weight]
    : choosenWeights.value.filter((current) => current !== weight);

  formData.value.weights = [...choosenWeights.value];
}

function updateMuscleGroups(muscleGroup: IMuscleGroup, isChecked: boolean) {
  choosenMuscleGroups.value = isChecked
    ? [...choosenMuscleGroups.value, muscleGroup]
    : choosenMuscleGroups.value.filter((current) => current._id !== muscleGroup._id);

  formData.value.muscleGroups = [...choosenMuscleGroups.value];
}

const { mutate: mutatePost, isPending: isLoadingPost } = postExercise({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    toast.success('Упражнение добавлено');
    router.push(URL_EXERCISE);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = updateExercise({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    toast.success('Упражнение обновлено');
  },
});

const { mutate: mutateDelete } = deleteExercise({
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
  if (isValid()) mutatePost(formData.value);
}

function update() {
  if (isValid()) mutateUpdate(formData.value);
}

function handleDelete(id: string) {
  mutateDelete(id);
}

onMounted(() => {
  if (props.exercise) {
    formData.value = clone(props.exercise);
    if (formData.value.weights?.length) choosenWeights.value = [...formData.value.weights];
    if (formData.value.muscleGroups?.length) choosenMuscleGroups.value = [...formData.value.muscleGroups];
  }
});
</script>
