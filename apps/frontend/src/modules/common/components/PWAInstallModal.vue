<template>
  <UiModal :modelValue="props.modelValue" @update:modelValue="(value) => emit('update:modelValue', value)" width="360">
    <UiFlex column>
      <div>Установить приложение FiT на устройство?</div>

      <UiFlex>
        <UiButton @click="props.installPWA" data-test="pwa-install-submit">Установить</UiButton>

        <UiButton @click="emit('update:modelValue', false)" layout="secondary" data-test="pwa-install-cancel">
          Отмена
        </UiButton>
      </UiFlex>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

interface IProps {
  modelValue: boolean;
  installPWA: () => void;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>
