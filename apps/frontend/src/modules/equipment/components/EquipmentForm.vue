<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="equipment-form">
      <UiField :label="t('title')" isRequired :error="error('title')">
        <UiInput v-model="formData.title" data-test="equipment-form-title" />
      </UiField>

      <UiField :label="`${t('title')} EN`" :error="error('title_en')">
        <UiInput v-model="formData.title_en" data-test="equipment-form-title-en" />
      </UiField>

      <UiCheckbox
        v-model="formData.isWeights"
        :label="t('equipment.isWeights')"
        data-test="equipment-form-is-weights"
      />

      <FormButtons
        :id="props.equipment?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        :isEdit="props.isEdit"
        @delete="(id) => mutateDelete(id)"
        data-test="equipment-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { UiCheckbox, UiField, UiFlex, UiInput, toast } from 'mhz-ui';
import { useQueryClient, useValidator, required, clone } from 'mhz-helpers';
import { API_EQUIPMENT, IEquipment } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';

import { URL_EQUIPMENT } from '@/equipment/constants';
import { equipmentService } from '@/equipment/services';

interface IProps {
  equipment?: IEquipment | null;
  isEdit?: boolean;
}

const props = defineProps<IProps>();

const router = useRouter();
const { t, locale } = useI18n();
const queryClient = useQueryClient();

const formData = ref<IEquipment>({
  title: '',
  title_en: '',
  isWeights: false,
});

const { mutate: mutatePost, isPending: isLoadingPost } = equipmentService.create({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EQUIPMENT] });
    toast.success(t('equipment.added'));
    router.push(URL_EQUIPMENT);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = equipmentService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_EQUIPMENT] });
    toast.success(t('equipment.updated'));
  },
});

const { mutate: mutateDelete } = equipmentService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_EQUIPMENT] });
    await queryClient.refetchQueries({ queryKey: [API_EQUIPMENT] });
    toast.success(t('equipment.deleted'));
    router.push(URL_EQUIPMENT);
  },
});

const { error, isValid } = useValidator(formData, {
  title: [required(locale.value)],
});

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
