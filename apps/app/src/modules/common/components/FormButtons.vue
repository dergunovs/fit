<template>
  <div :class="$style.buttons">
    <UiFlex gap="16">
      <UiButton type="submit" :isDisabled="props.isLoading" data-test="form-buttons-submit">
        {{ submitButtonText }}
      </UiButton>

      <UiButton @click="router.go(-1)" layout="secondary" :isDisabled="props.isLoading" data-test="form-buttons-back">
        Назад
      </UiButton>
    </UiFlex>

    <UiButton
      v-if="props.id"
      @click="isShowConfirm = true"
      layout="secondary"
      :isDisabled="props.isLoading"
      data-test="form-buttons-delete"
    >
      Удалить
    </UiButton>

    <UiModal
      v-model="isShowConfirm"
      isConfirm
      @confirm="emit('delete', props.id)"
      width="380"
      lang="ru"
      data-test="form-buttons-confirm-modal"
    >
      Подтверждаете удаление?
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';
import { CREATE_BUTTON_TEXT, UPDATE_BUTTON_TEXT } from '@/common/constants';

interface IProps {
  id?: string;
  isLoading?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits(['delete']);

const isShowConfirm = ref(false);

const router = useRouter();

const submitButtonText = computed(() => (props.id ? UPDATE_BUTTON_TEXT : CREATE_BUTTON_TEXT));
</script>

<style module lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

@media (max-width: 960px) {
  .buttons {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
