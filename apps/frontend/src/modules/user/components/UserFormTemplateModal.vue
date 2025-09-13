<template>
  <form @submit.prevent="submit" :class="$style.form" data-test="template-form-modal">
    <UiField :label="t('title')" isRequired :error="error('title')">
      <UiInput v-model="formData.title" data-test="template-form-title" />
    </UiField>

    <ActivityPotentialDuration :exercises="formData.exercises" data-test="template-form-potential-duration" />

    <UiButton @click="isShowModal = true" isNarrow layout="secondary" data-test="template-form-add-exercise">
      {{ t('exercise.add') }}
    </UiButton>

    <ExerciseManagment
      v-model="formData.exercises"
      :isShowModal="isShowModal"
      @updateModal="(value) => (isShowModal = value)"
      data-test="user-form-template-exercise-managment"
    />

    <FormButtons
      :id="props.template?._id"
      :isEdit="!!props.template?._id"
      isHideBackButton
      @delete="(id) => emit('delete', id)"
      data-test="template-form-buttons"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { UiField, UiInput, UiButton } from 'mhz-ui';
import { useValidator, required, clone, deleteTempId } from 'mhz-helpers';
import { IUserTemplate } from 'fitness-tracker-contracts';

import ActivityPotentialDuration from '@/activity/components/ActivityPotentialDuration.vue';
import ExerciseManagment from '@/exercise/components/ExerciseManagment.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { useTI18n } from '@/common/composables';

interface IProps {
  template?: IUserTemplate;
}

interface IEmit {
  create: [template: IUserTemplate];
  edit: [template: IUserTemplate];
  delete: [id: string];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useTI18n();

const formData = ref<IUserTemplate>({
  title: '',
  exercises: [],
});

const isShowModal = ref(false);

const { error, isValid } = useValidator(formData, { title: [required] }, locale.value);

function submit() {
  if (!isValid() || formData.value.exercises.length === 0) return;

  formData.value.exercises = deleteTempId(formData.value.exercises);

  if (props.template?._id) {
    emit('edit', formData.value);
  } else {
    emit('create', formData.value);
  }
}

onBeforeMount(() => {
  if (props.template) formData.value = clone(props.template);
});
</script>

<style module lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 30dvh;
}
</style>
