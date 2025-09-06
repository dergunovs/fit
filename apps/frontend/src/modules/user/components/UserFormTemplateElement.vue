<template>
  <UiChip>
    <span>
      {{ props.template.title }}
    </span>

    <button @click="emit('edit', template)" type="button" :class="$style.edit" data-test="user-form-template-edit">
      <IconEdit width="20" height="20" />
    </button>

    <UiClose
      v-if="props.template._id"
      @click="emit('delete', props.template._id)"
      isSmall
      isDelete
      data-test="user-form-template-delete"
    />
  </UiChip>
</template>

<script setup lang="ts">
import { UiChip, UiClose } from 'mhz-ui';
import { IUserTemplate } from 'fitness-tracker-contracts';

import IconEdit from '@/common/icons/edit.svg';

interface IProps {
  template: IUserTemplate;
}

interface IEmit {
  edit: [template: IUserTemplate];
  delete: [id: string];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();
</script>

<style module lang="scss">
.edit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
