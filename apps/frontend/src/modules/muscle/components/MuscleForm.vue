<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="muscle-form">
      <UiField label="Название" isRequired :error="error('title')">
        <UiInput v-model="formData.title" data-test="muscle-form-title" />
      </UiField>

      <UiField label="Цвет" isRequired :error="error('color')">
        <UiInput v-model="formData.color" data-test="muscle-form-color" />
      </UiField>

      <div
        v-if="formData.color"
        :class="$style.color"
        :style="{ background: formData.color }"
        data-test="muscle-form-color-example"
      ></div>

      <FormButtons
        :id="props.muscle?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        :isEdit="props.isEdit"
        @delete="(id) => mutateDelete(id)"
        data-test="muscle-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UiField, UiInput, toast, UiFlex } from 'mhz-ui';
import { useQueryClient, useValidator, required, clone } from 'mhz-helpers';
import { API_MUSCLE, IMuscle } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';

import { URL_MUSCLE } from '@/muscle/constants';
import { muscleService } from '@/muscle/services';

interface IProps {
  muscle?: IMuscle | null;
  isEdit?: boolean;
}

const props = defineProps<IProps>();

const queryClient = useQueryClient();

const router = useRouter();

const formData = ref<IMuscle>({
  title: '',
  color: '',
});

const { mutate: mutatePost, isPending: isLoadingPost } = muscleService.create({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_MUSCLE] });
    toast.success('Группа мышц добавлена');
    router.push(URL_MUSCLE);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = muscleService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_MUSCLE] });
    toast.success('Группа мышц обновлена');
  },
});

const { mutate: mutateDelete } = muscleService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_MUSCLE] });
    await queryClient.refetchQueries({ queryKey: [API_MUSCLE] });
    toast.success('Группа мышц удалена');
    router.push(URL_MUSCLE);
  },
});

const { error, isValid } = useValidator(formData, {
  title: [required()],
  color: [required()],
});

function submit() {
  if (!isValid()) return;

  if (props.muscle?._id) {
    mutateUpdate(formData.value);
  } else {
    mutatePost(formData.value);
  }
}

onMounted(() => {
  if (props.muscle) {
    formData.value = clone(props.muscle);
  }
});
</script>

<style module lang="scss">
.color {
  width: 100px;
  height: 100px;
}
</style>
