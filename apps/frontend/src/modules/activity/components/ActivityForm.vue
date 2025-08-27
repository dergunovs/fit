<template>
  <div v-if="isShowForm" data-test="activity-form-container">
    <h2>{{ t('activity.form') }}</h2>

    <UiFlex @submit.prevent="submit" tag="form" column gap="24" data-test="activity-form">
      <p>
        <span>{{ t('activity.approximateDuration') }}: </span>

        <span v-if="formData.exercises" data-test="activity-form-potential-duration">
          {{
            getPotentialActivityDuration(formData.exercises, locale, props.exerciseStatistics, props.averageRestPercent)
          }}
        </span>
      </p>

      <UiFlex justify="space-between">
        <UiButton
          @click="repeatLastActivity"
          :isDisabled="lastActivity === null"
          isNarrow
          layout="secondary"
          data-test="activity-form-repeat-last"
        >
          {{ t('activity.repeatLast') }}
        </UiButton>

        <UiButton
          @click="isShowCalendar = !isShowCalendar"
          :isDisabled="!isValid"
          isNarrow
          layout="secondary"
          data-test="activity-form-toggle-calendar"
        >
          {{ toggleCalendarText }}
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

      <UiModal v-model="isShowModal" width="360" data-test="activity-form-add-exercise-modal">
        <ExerciseChooseList
          v-if="exercises?.length"
          :exercises="exercises"
          @choose="addExercise"
          data-test="activity-form-exercise-choose-list"
        />
      </UiModal>

      <UiFlex v-if="formData.exercises?.length" column data-test="activity-form-exercises-choosen-container">
        <h3>{{ t('exercise.many') }}</h3>

        <ExerciseChoosenList
          :choosenExercises="formData.exercises"
          @delete="deleteExercise"
          @createSet="createSet"
          data-test="activity-form-exercises-choosen"
        />
      </UiFlex>

      <FormButtonsLayout isFixed>
        <UiButton @click="isShowModal = true" isNarrow data-test="activity-form-add-exercise">
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
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { toast, UiButton, UiCalendar, UiFlex, UiModal } from 'mhz-ui';
import { createTempId, deleteTempId, formatDate, useQueryClient, useRouteId } from 'mhz-helpers';
import {
  API_ACTIVITY,
  IActivity,
  IExerciseChoosen,
  IExerciseStatistics,
  TPostActivityDTO,
} from 'fitness-tracker-contracts';

import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';
import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';

import { exerciseService } from '@/exercise/services';
import { activityService } from '@/activity/services';
import { getPotentialActivityDuration, generateActivityExercises } from '@/activity/helpers';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';

interface IProps {
  exerciseStatistics: IExerciseStatistics[];
  averageRestPercent: number;
}

const props = defineProps<IProps>();

const router = useRouter();

const { t, locale } = useI18n();

const { id } = useRouteId('copy', true);

const queryClient = useQueryClient();

const formData = ref<IActivity>({
  exercises: [],
  isDone: false,
  dateScheduled: undefined,
});

const isShowModal = ref(false);
const isShowForm = ref(true);
const isShowCalendar = ref(false);

const toggleCalendarText = computed(() =>
  isShowCalendar.value ? t('activity.hideCalendar') : t('activity.openCalendar')
);

const dateScheduledText = computed(() =>
  formData.value.dateScheduled ? t('activity.date') : t('activity.chooseDate')
);

const { data: exercises } = exerciseService.getAll();
const { data: lastActivity } = activityService.getLast();
const { data: activity } = activityService.getOne({ enabled: !!id.value }, id);

watch(
  () => activity.value,
  () => {
    if (activity.value) formData.value.exercises = generateActivityExercises(activity.value.exercises);
  }
);

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

function repeatLastActivity() {
  if (!lastActivity.value || Object.keys(lastActivity.value).length === 0) return;

  formData.value.exercises = generateActivityExercises(lastActivity.value.exercises);
}

function setScheduledDate(date: Date) {
  date.setHours(23, 59, 59);
  formData.value.dateScheduled = new Date(date);
}

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

onBeforeMount(() => {
  if (activity.value) formData.value.exercises = generateActivityExercises(activity.value.exercises);
});
</script>
