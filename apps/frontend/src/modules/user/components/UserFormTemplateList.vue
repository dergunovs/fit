<template>
  <UiFlex wrap>
    <UserFormTemplateElement
      v-for="template in props.templates"
      :key="template._id"
      :template="template"
      @edit="(template) => emit('edit', template)"
      @delete="(id) => emit('delete', id)"
      data-test="user-form-template-element"
    />
  </UiFlex>
</template>

<script setup lang="ts">
import { IUserTemplate } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';

import UserFormTemplateElement from '@/user/components/UserFormTemplateElement.vue';

interface IProps {
  templates: IUserTemplate[];
}

interface IEmit {
  edit: [template: IUserTemplate];
  delete: [id: string];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();
</script>
