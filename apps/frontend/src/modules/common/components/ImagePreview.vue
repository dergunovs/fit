<template>
  <div :class="$style.image">
    <img :src="pathToImage" width="200" alt="Image" crossorigin="anonymous" data-test="image-preview" />
    <UiButton @click="emit('delete')" layout="plain" data-test="image-preview-delete">{{ t('delete') }}</UiButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UiButton } from 'mhz-ui';

import { useTI18n } from '@/common/composables';

interface IProps {
  url: string;
}

interface IEmit {
  delete: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const pathToImage = computed(() => `${import.meta.env.VITE_PATH_UPLOAD}${props.url}`);

const { t } = useTI18n();
</script>

<style module lang="scss">
.container {
  display: flex;
}

.image {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  padding: 8px;
  border: 1px solid var(--color-gray);
  border-radius: 16px;
}
</style>
