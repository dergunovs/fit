<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="equipment-form">
      <UiField label="Название" isRequired :error="error('title')">
        <UiInput v-model="formData.title" data-test="equipment-form-title" />
      </UiField>

      <UiCheckbox
        v-model="formData.isWeights"
        label="Наличие веса у оборудования"
        data-test="equipment-form-is-weights"
      />

      <FormButtons
        :id="props.equipment?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        @delete="(id) => mutateDelete(id)"
        data-test="equipment-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UiCheckbox, UiField, UiFlex, UiInput, toast } from 'mhz-ui';
import { useQueryClient, useValidator, required, clone } from 'mhz-helpers';
import { API_EQUIPMENT, IEquipment } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';

import { URL_EQUIPMENT } from '@/equipment/constants';
import { equipmentService } from '@/equipment/services';

interface IProps {
  equipment?: IEquipment;
}

const props = defineProps<IProps>();

const queryClient = useQueryClient();

const router = useRouter();

const formData = ref<IEquipment>({
  title: '',
  isWeights: false,
});

const { mutate: mutatePost, isPending: isLoadingPost } = equipmentService.create({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EQUIPMENT] });
    toast.success('Оборудование добавлено');
    router.push(URL_EQUIPMENT);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = equipmentService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EQUIPMENT] });
    toast.success('Оборудование обновлено');
  },
});

const { mutate: mutateDelete } = equipmentService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_EQUIPMENT] });
    await queryClient.refetchQueries({ queryKey: [API_EQUIPMENT] });
    toast.success('Оборудование удалено');
    router.push(URL_EQUIPMENT);
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

  if (props.equipment?._id) {
    mutateUpdate(formData.value);
  } else {
    mutatePost(formData.value);
  }
}

onMounted(() => {
  if (props.equipment) formData.value = clone(props.equipment);
});
</script>
