<template>
  <div :class="$style.form">
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="template-form-modal">
      <UiField :label="t('title')" isRequired :error="error('title')">
        <UiInput v-model="formData.title" data-test="template-form-title" />
      </UiField>

      <ActivityPotentialDuration :exercises="formData.exercises" data-test="template-form-potential-duration" />

      <UiButton @click="isShowModal = true" isNarrow layout="secondary" data-test="template-form-add-exercise">
        {{ t('exercise.add') }}
      </UiButton>

      <UiModal v-model="isShowModal" isScrollable data-test="template-form-add-exercise-modal">
        <ExerciseChooseList
          v-if="exercises?.length"
          :exercises="exercises"
          @choose="addExercise"
          data-test="template-form-exercise-choose-list"
        />
      </UiModal>

      <ExerciseChoosenList
        v-if="formData.exercises?.length"
        :choosenExercises="formData.exercises"
        @delete="deleteExercise"
        @createSet="createSet"
        data-test="template-form-exercise-choosen-list"
      />

      <FormButtons
        :id="props.template?._id"
        :isEdit="!!props.template?._id"
        isHideBackButton
        @delete="(id) => emit('delete', id)"
        data-test="template-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { UiField, UiInput, UiFlex, UiModal, UiButton } from 'mhz-ui';
import { useValidator, required, clone, createTempId, deleteTempId } from 'mhz-helpers';
import { IExerciseChoosen, IUserTemplate } from 'fitness-tracker-contracts';

import ActivityPotentialDuration from '@/activity/components/ActivityPotentialDuration.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { useTI18n } from '@/common/composables';
import { exerciseService } from '@/exercise/services';

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

const { data: exercises } = exerciseService.getAll();

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

function addExercise(exercise: IExerciseChoosen) {
  formData.value.exercises = formData.value.exercises?.length ? [...formData.value.exercises, exercise] : [exercise];

  isShowModal.value = false;
}

function deleteExercise(idToDelete: string) {
  formData.value.exercises = formData.value.exercises.filter((exercise) => exercise._id !== idToDelete);
}

function createSet() {
  const set = formData.value.exercises.slice(-2).map((exercise) => {
    return { ...exercise, _id: createTempId() };
  });

  formData.value.exercises = [...formData.value.exercises, ...set];
}

onBeforeMount(() => {
  if (props.template) formData.value = clone(props.template);
});
</script>

<style module lang="scss">
.form {
  min-height: 53dvh;
}
</style>
