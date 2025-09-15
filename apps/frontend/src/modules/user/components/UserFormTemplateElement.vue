<template>
  <UiChip
    v-if="props.template._id"
    isEdit
    isDelete
    @edit="emit('edit')"
    @delete="emit('delete')"
    data-test="user-form-template"
  >
    <span data-test="user-form-template-title">
      {{ props.template.title }}
    </span>
  </UiChip>
</template>

<script setup lang="ts">
import { UiChip } from 'mhz-ui';
import { IUserTemplate } from 'fitness-tracker-contracts';

interface IProps {
  template: IUserTemplate;
}

interface IEmit {
  edit: [];
  delete: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();
</script>
