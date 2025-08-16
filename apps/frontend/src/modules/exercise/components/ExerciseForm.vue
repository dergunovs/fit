<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="exercise-form">
      <UiField :label="t('title')" isRequired :error="error('title')">
        <UiInput v-model="formData.title" data-test="exercise-form-title" />
      </UiField>

      <UiField :label="`${t('title')} EN`" :error="error('title_en')">
        <UiInput v-model="formData.title_en" data-test="exercise-form-title-en" />
      </UiField>

      <UiField :label="t('description')">
        <UiEditor v-model="formData.description" data-test="exercise-form-description" />
      </UiField>

      <UiField :label="`${t('description')} EN`">
        <UiEditor v-model="formData.description_en" data-test="exercise-form-description-en" />
      </UiField>

      <UiCheckbox v-model="formData.isWeights" :label="t('exercise.isWeights')" data-test="exercise-form-is-weights" />

      <UiCheckbox
        v-if="formData.isWeights"
        v-model="formData.isWeightsRequired"
        :label="t('exercise.isWeightsRequired')"
        data-test="exercise-form-is-weights-required"
      />

      <UiField :label="t('equipment.used')">
        <UiSelect
          v-model="formData.equipment"
          :options="filterEquipmentByWeights(equipments)"
          isClearable
          :isLocaleField="locale === 'en'"
          :lang="locale"
        />
      </UiField>

      <UiFlex v-if="formData.isWeights" column>
        <div>{{ t('equipment.suitable') }}</div>

        <UiCheckbox
          v-for="equipment in filterEquipmentByWeights(equipments, true)"
          :key="equipment.title"
          :modelValue="choosenEquipmentForWeight.some((eq) => equipment._id === eq._id)"
          @update:modelValue="updateEquipment(equipment, !!$event)"
          :label="equipment[localeField('title', locale)]"
          data-test="exercise-form-equipment-for-weight"
        />
      </UiFlex>

      <UiFlex column>
        <div>{{ t('muscle.involved') }}</div>

        <UiCheckbox
          v-for="muscle in muscles"
          :key="muscle._id"
          :modelValue="choosenMuscles.some((group) => group._id === muscle._id)"
          @update:modelValue="updateMuscles(muscle, !!$event)"
          :label="muscle[localeField('title', locale)]"
          data-test="exercise-form-muscle-groups"
        />
      </UiFlex>

      <FormButtons
        :id="props.exercise?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        :isEdit="props.isEdit"
        :isEmitCancel="props.isDisableRedirect"
        :isFixed="props.isFixed"
        @delete="(id) => mutateDelete(id)"
        @cancel="emit('hide')"
        data-test="exercise-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { UiField, UiInput, UiCheckbox, toast, UiSelect, UiFlex, UiEditor } from 'mhz-ui';
import { useQueryClient, useValidator, required, clone, localeField } from 'mhz-helpers';
import { IExercise, IMuscle, IEquipment, API_EXERCISE, API_ACTIVITY_STATISTICS } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';

import { exerciseService } from '@/exercise/services';
import { equipmentService } from '@/equipment/services';
import { muscleService } from '@/muscle/services';
import { URL_EXERCISE } from '@/exercise/constants';
import { filterEquipmentByWeights } from '@/equipment/helpers';

interface IProps {
  exercise?: IExercise;
  isEdit?: boolean;
  isDisableRedirect?: boolean;
  isFixed?: boolean;
}

interface IEmit {
  hide: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const router = useRouter();
const { t, locale } = useI18n();
const queryClient = useQueryClient();

const formData = ref<IExercise>({
  title: '',
  title_en: '',
  description: '',
  description_en: '',
  muscles: [],
  isWeights: false,
  isWeightsRequired: false,
  equipment: undefined,
  equipmentForWeight: [],
});

const choosenMuscles = ref<IMuscle[]>([]);
const choosenEquipmentForWeight = ref<IEquipment[]>([]);

const { data: equipments } = equipmentService.getAll();
const { data: muscles } = muscleService.getAll();

function updateMuscles(muscle: IMuscle, isChecked: boolean) {
  choosenMuscles.value = isChecked
    ? [...choosenMuscles.value, muscle]
    : choosenMuscles.value.filter((current) => current._id !== muscle._id);

  formData.value.muscles = [...choosenMuscles.value];
}

function updateEquipment(equipment: IEquipment, isChecked: boolean) {
  choosenEquipmentForWeight.value = isChecked
    ? [...choosenEquipmentForWeight.value, equipment]
    : choosenEquipmentForWeight.value.filter((current) => current._id !== equipment._id);

  formData.value.equipmentForWeight = [...choosenEquipmentForWeight.value];
}

const { mutate: mutatePost, isPending: isLoadingPost } = exerciseService.create({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    toast.success(t('exercise.added'));
    if (!props.isDisableRedirect) router.push(URL_EXERCISE);
    emit('hide');
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = exerciseService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    toast.success(t('exercise.updated'));
    emit('hide');
  },
});

const { mutate: mutateDelete } = exerciseService.delete({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EXERCISE] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    toast.success(t('exercise.deleted'));
    if (!props.isDisableRedirect) router.push(URL_EXERCISE);
    emit('hide');
  },
});

const { error, isValid } = useValidator(formData, {
  title: [required(locale.value)],
});

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

    if (formData.value.muscles?.length) choosenMuscles.value = [...formData.value.muscles];
    if (formData.value.equipmentForWeight?.length)
      choosenEquipmentForWeight.value = [...formData.value.equipmentForWeight];
  }
});
</script>
