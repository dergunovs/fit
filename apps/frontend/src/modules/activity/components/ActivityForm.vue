<template>
  <div v-if="isShowForm" data-test="activity-form-container">
    <h2>{{ t('activity.form') }}</h2>

    <UiFlex @submit.prevent="submit" tag="form" column gap="24" data-test="activity-form">
      <ActivityPotentialDuration :exercises="formData.exercises" data-test="activity-form-potential-duration" />

      <UiFlex justify="space-between">
        <UiButton @click="isShowTemplatesModal = true" isNarrow layout="secondary" data-test="activity-form-templates">
          {{ t('template.many') }}
        </UiButton>

        <UiButton
          @click="isShowCalendar = !isShowCalendar"
          :isDisabled="!isValid"
          isNarrow
          layout="secondary"
          data-test="activity-form-toggle-calendar"
        >
          {{ t('calendar') }}
        </UiButton>
      </UiFlex>

      <UiFlex v-if="isShowCalendar" column gap="16" data-test="activity-form-calendar-block">
        <UiFlex gap="4">
          <div>{{ dateScheduledText }}</div>

          <b v-if="formData.dateScheduled" data-test="activity-form-date-scheduled">
            {{ formatDate(formData.dateScheduled, locale) }}
          </b>
        </UiFlex>

        <UiButton
          @click="submit(true)"
          :isDisabled="!formData.dateScheduled || !isValid"
          data-test="activity-form-save-to-calendar"
        >
          {{ t('activity.saveToCalendar') }}
        </UiButton>

        <UiCalendar
          :minDate="new Date()"
          :lang="locale"
          @chooseDate="setScheduledDate"
          data-test="activity-form-calendar"
        />
      </UiFlex>

      <UiModal v-model="isShowTemplatesModal">
        <UiFlex column gap="32">
          <UiFlex column gap="16">
            <UiField :label="t('title')">
              <UiInput v-model="templateTitle" />
            </UiField>

            <UiButton
              @click="createTemplate"
              :isDisabled="templateTitle.length === 0 || formData.exercises.length === 0"
              layout="secondary"
            >
              {{ t('template.save') }}
            </UiButton>
          </UiFlex>

          <UiFlex v-if="user?.templates" column gap="16">
            <UiField :label="t('template.one')">
              <UiSelect
                v-model="currentTemplate"
                :lang="locale"
                :options="user.templates"
                data-test="activity-form-template-select"
              />
            </UiField>

            <UiButton @click="chooseTemplate" :isDisabled="!currentTemplate">{{ t('choose') }}</UiButton>
          </UiFlex>
        </UiFlex>
      </UiModal>

      <UiModal v-model="isShowExercisesModal" isScrollable data-test="activity-form-add-exercise-modal">
        <ExerciseChooseList
          v-if="exercises?.length"
          :exercises="exercises"
          @choose="addExercise"
          data-test="activity-form-exercise-choose-list"
        />
      </UiModal>

      <ExerciseChoosenList
        v-if="formData.exercises?.length"
        :choosenExercises="formData.exercises"
        @delete="deleteExercise"
        @createSet="createSet"
        data-test="activity-form-exercises-choosen"
      />

      <FormButtonsLayout isFixed>
        <UiButton @click="isShowExercisesModal = true" isNarrow data-test="activity-form-add-exercise">
          {{ t('exercise.add') }}
        </UiButton>

        <UiButton
          layout="accent"
          isNarrow
          :isDisabled="!isValid || isLoadingPost"
          type="submit"
          data-test="activity-form-submit"
        >
          {{ t('activity.start') }}
        </UiButton>
      </FormButtonsLayout>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiCalendar, UiFlex, UiModal, UiSelect, UiField, UiInput } from 'mhz-ui';
import { createTempId, deleteTempId, formatDate, useQueryClient } from 'mhz-helpers';
import {
  API_ACTIVITY,
  API_AUTH_GET,
  API_USER,
  IActivity,
  IExerciseChoosen,
  IUserTemplate,
  TPostActivityDTO,
} from 'fitness-tracker-contracts';

import ActivityPotentialDuration from '@/activity/components/ActivityPotentialDuration.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';
import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';

import { exerciseService } from '@/exercise/services';
import { activityService } from '@/activity/services';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';
import { useTI18n } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';
import { generateActivityExercises } from '@/activity/helpers';
import { userService } from '@/user/services';

const router = useRouter();

const { t, locale } = useTI18n();
const queryClient = useQueryClient();
const { user } = useAuthCheck();

const formData = ref<IActivity>({
  exercises: [],
  isDone: false,
  dateScheduled: undefined,
});

const isShowTemplatesModal = ref(false);
const isShowExercisesModal = ref(false);
const isShowForm = ref(true);
const isShowCalendar = ref(false);

const currentTemplate = ref<IUserTemplate>();
const templateTitle = ref('');

const dateScheduledText = computed(() =>
  formData.value.dateScheduled ? t('activity.date') : t('activity.chooseDate')
);

const { data: exercises } = exerciseService.getAll();

function addExercise(exercise: IExerciseChoosen) {
  formData.value.exercises = formData.value.exercises?.length ? [...formData.value.exercises, exercise] : [exercise];

  isShowExercisesModal.value = false;
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

function setScheduledDate(date: Date) {
  date.setHours(23, 59, 59);
  formData.value.dateScheduled = new Date(date);
}

function chooseTemplate() {
  isShowTemplatesModal.value = false;
  if (currentTemplate.value) formData.value.exercises = generateActivityExercises(currentTemplate.value.exercises);

  currentTemplate.value = undefined;
}

const { mutate: mutateUpdate } = userService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    await queryClient.refetchQueries({ queryKey: [API_AUTH_GET] });
    toast.success(t('template.added'));
  },
});

const { mutate: mutatePost, isPending: isLoadingPost } = activityService.create({
  onSuccess: async (activityId: TPostActivityDTO) => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
    toast.success(formData.value.dateScheduled ? t('activity.savedToCalendar') : t('activity.started'));
    router.push(formData.value.dateScheduled ? URL_HOME : `${URL_ACTIVITY_EDIT}/${activityId}`);
  },
});

const isValid = computed(() => !!formData.value.exercises?.length);

function submit(isAddToCalendar?: boolean) {
  if (!isValid.value) return;

  isShowForm.value = false;
  if (!isAddToCalendar) formData.value.dateScheduled = undefined;
  formData.value.exercises = deleteTempId(formData.value.exercises);

  mutatePost(formData.value);
}

function createTemplate() {
  if (!formData.value.exercises) return;

  isShowTemplatesModal.value = false;

  const templateToCreate = { title: templateTitle.value, exercises: deleteTempId(formData.value.exercises) };

  const templates = user.value?.templates ? [...user.value.templates, templateToCreate] : [templateToCreate];

  if (user.value) mutateUpdate({ ...user.value, templates });

  currentTemplate.value = undefined;
  templateTitle.value = '';
}
</script>
