<template>
  <UiFlex v-if="(props.isEdit && props.id) || !props.isEdit" justify="space-between" grow>
    <UiFlex>
      <UiButton type="submit" :isDisabled="props.isLoading" data-test="form-buttons-submit">
        {{ props.id ? t('save') : t('create') }}
      </UiButton>

      <UiButton
        @click="props.isEmitCancel ? emit('cancel') : router.go(-1)"
        layout="secondary"
        :isDisabled="props.isLoading"
        isNarrow
        data-test="form-buttons-back"
      >
        {{ t('back') }}
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
      {{ t('delete') }}
    </UiButton>

    <UiModal
      v-if="props.id"
      v-model="isShowConfirm"
      isConfirm
      @confirm="emit('delete', props.id)"
      width="360"
      :lang="locale"
      data-test="form-buttons-confirm-modal"
    >
      {{ t('confirmDelete') }}?
    </UiModal>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

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
const { t, locale } = useI18n();
</script>
