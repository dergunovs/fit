<template>
  <UiFlex v-if="(props.isEdit && props.id) || !props.isEdit" justify="space-between" grow>
    <UiFlex>
      <UiButton type="submit" :isDisabled="props.isLoading" data-test="form-buttons-submit">
        {{ submitButtonText }}
      </UiButton>

      <UiButton
        @click="props.isEmitCancel ? emit('cancel') : router.go(-1)"
        layout="secondary"
        :isDisabled="props.isLoading"
        isNarrow
        data-test="form-buttons-back"
      >
        Назад
      </UiButton>
    </UiFlex>

    <UiButton
      v-if="props.id"
      @click="isShowConfirm = true"
      layout="secondary"
      :isDisabled="props.isLoading"
      isNarrow
      data-test="form-buttons-delete"
    >
      Удалить
    </UiButton>

    <UiModal
      v-if="props.id"
      v-model="isShowConfirm"
      isConfirm
      @confirm="emit('delete', props.id)"
      width="360"
      data-test="form-buttons-confirm-modal"
    >
      Подтверждаете удаление?
    </UiModal>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

import { CREATE_BUTTON_TEXT, UPDATE_BUTTON_TEXT } from '@/common/constants';

interface IProps {
  id?: string;
  isLoading?: boolean;
  isEdit?: boolean;
  isEmitCancel?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ delete: [id: string]; cancel: [] }>();

const isShowConfirm = ref(false);

const router = useRouter();

const submitButtonText = computed(() => (props.id ? UPDATE_BUTTON_TEXT : CREATE_BUTTON_TEXT));
</script>
