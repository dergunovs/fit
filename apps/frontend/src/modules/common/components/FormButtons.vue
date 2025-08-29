<template>
  <FormButtonsLayout v-if="(props.isEdit && props.id) || !props.isEdit" :isFixed="props.isFixed">
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
      :lang="locale"
      data-test="form-buttons-confirm-modal"
    >
      {{ t('confirmDelete') }}?
    </UiModal>
  </FormButtonsLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { UiButton, UiModal, UiFlex } from 'mhz-ui';
import { TLocale } from 'fitness-tracker-contracts';

import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';

interface IProps {
  id?: string;
  isLoading?: boolean;
  isEdit?: boolean;
  isEmitCancel?: boolean;
  isFixed?: boolean;
}

interface IEmit {
  delete: [id: string];
  cancel: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const isShowConfirm = ref(false);

const router = useRouter();
const { t, locale } = useI18n<DefaultLocaleMessageSchema, TLocale>();
</script>
