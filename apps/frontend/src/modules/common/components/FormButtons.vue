<template>
  <div :class="$style.buttons" :data-loaded="isLoaded">
    <UiFlex>
      <UiButton type="submit" :isDisabled="props.isLoading" data-test="form-buttons-submit">
        {{ submitButtonText }}
      </UiButton>

      <UiButton
        @click="router.go(-1)"
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
      lang="ru"
      data-test="form-buttons-confirm-modal"
    >
      Подтверждаете удаление?
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

import { CREATE_BUTTON_TEXT, UPDATE_BUTTON_TEXT } from '@/common/constants';

interface IProps {
  id?: string;
  isLoading?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ delete: [id: string] }>();

const isShowConfirm = ref(false);
const isLoaded = ref(false);

const router = useRouter();

const submitButtonText = computed(() => (props.id ? UPDATE_BUTTON_TEXT : CREATE_BUTTON_TEXT));

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 200);
});
</script>

<style module lang="scss">
.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  opacity: 0;

  &[data-loaded='true'] {
    opacity: 1;
  }
}
</style>
