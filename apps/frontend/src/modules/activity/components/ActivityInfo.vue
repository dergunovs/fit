<template>
  <UiFlex column gap="16" :data-scrollable="props.isPopup" data-test="activity-info">
    <UiFlex gap="4" align="center" wrap>
      <ActivityTimeline
        v-if="props.isPopup && isExercisesDone"
        :exercises="props.exercises"
        :start="props.start"
        data-test="activity-timeline"
      />

      <UiFlex>
        <UiFlex gap="2" align="center" data-test="activity-info-start-date">
          <IconDate width="16" height="16" /> {{ formatDate(props.start, locale) }}
        </UiFlex>

        <UiFlex gap="2" align="center" data-test="activity-info-duration">
          <IconDuration width="16" height="16" />
          {{
            isExercisesDone
              ? subtractDates(props.end, props.start, locale)
              : getPotentialActivityDuration(
                  props.exercises,
                  locale,
                  statistics?.exercise,
                  statistics?.activity.averageRestPercent.cur
                )
          }}
        </UiFlex>
      </UiFlex>

      <div>
        {{ t('set.many') }}: <span data-test="activity-info-sets">{{ props.exercises.length }}</span
        ><template v-if="isExercisesDone"
          >, {{ t('failures').toLowerCase() }}:
          <span data-test="activity-info-to-failure-percent">{{ getToFailurePercent(props.exercises) }}</span
          >, {{ t('rest').toLowerCase() }}:
          <span data-test="activity-info-rest-percent">
            {{ getRestPercent(props.exercises, locale, props.start, props.end) }}
          </span>
        </template>
      </div>

      <UiButton
        v-if="isExercisesDone"
        @click="copyToClipboard(createActivityClipboardText(), t('copiedToClipboard'))"
        layout="plain"
        data-test="activity-info-copy-to-clipboard"
      >
        {{ t('copyToClipboard') }}
      </UiButton>
    </UiFlex>

    <MuscleStatistics
      v-if="muscles"
      :statistics="generateMuscleStatistics(props.exercises, muscles, locale)"
      data-test="activity-info-muscle-statistics"
    />

    <UiFlex column>
      <ExerciseElement
        v-for="(exercise, index) in props.exercises"
        :key="exercise._id"
        :exercise="exercise"
        :index="index"
        :duration="exercise.duration"
        :isFutureActivity="isFutureActivity"
        :isHideTitle="isPrevExerciseSame(props.exercises, index, exercise.exercise?._id)"
        :isDone="exercise.isDone"
        :isToFailure="exercise.isToFailure"
        data-test="activity-info-exercise-element"
      />
    </UiFlex>

    <FormButtonsLayout :isFixed="!isPopup">
      <UiButton
        v-if="isAuth && isPopup && !isFutureActivity"
        @click="createUserTemplate"
        data-test="activity-info-create-template"
      >
        {{ t('template.create') }}
      </UiButton>

      <UiButton
        v-if="isAuth && isPopup && isFutureActivity"
        @click="router.push(`${URL_ACTIVITY_EDIT}/${props.id}`)"
        data-test="activity-info-start"
      >
        {{ t('start') }}
      </UiButton>

      <UiButton v-if="!isPopup" @click="router.go(-1)" data-test="activity-info-go-back-button">
        {{ t('back') }}
      </UiButton>

      <UiButton
        v-if="isAuth"
        @click="isShowConfirm = true"
        isNarrow
        layout="secondary"
        data-test="activity-info-delete"
      >
        {{ t('delete') }}
      </UiButton>
    </FormButtonsLayout>

    <UiModal
      v-model="isShowConfirm"
      isConfirm
      @confirm="mutateDelete(id)"
      :lang="locale"
      data-test="activity-info-modal"
    >
      {{ t('confirmDelete') }}?
    </UiModal>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { API_ACTIVITY, API_ACTIVITY_CALENDAR, IExerciseDone, IUserTemplate } from 'fitness-tracker-contracts';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import {
  formatDate,
  subtractDates,
  isAuth,
  useQueryClient,
  formatDuration,
  localeField,
  deleteTempId,
} from 'mhz-helpers';

import ActivityTimeline from '@/activity/components/ActivityTimeline.vue';
import ExerciseElement from '@/exercise/components/ExerciseElement.vue';
import MuscleStatistics from '@/muscle/components/MuscleStatistics.vue';
import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';
import IconDate from '@/common/icons/date.svg';
import IconDuration from '@/common/icons/duration.svg';

import { ACTIVITY_STATISTICS_GAP, URL_ACTIVITY_EDIT } from '@/activity/constants';
import {
  getRestPercent,
  getToFailurePercent,
  getPotentialActivityDuration,
  generateActivityExercises,
} from '@/activity/helpers';
import { isPrevExerciseSame } from '@/exercise/helpers';
import { activityService } from '@/activity/services';
import { muscleService } from '@/muscle/services';
import { generateMuscleStatistics } from '@/muscle/helpers';
import { copyToClipboard } from '@/common/helpers';
import { useTI18n } from '@/common/composables';

interface IProps {
  id: string;
  exercises: IExerciseDone[];
  start: Date | string | null;
  end?: Date | string | null;
  isPopup?: boolean;
}

interface IEmit {
  delete: [];
  createTemplate: [template: IUserTemplate];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const router = useRouter();
const { t, locale } = useTI18n();
const queryClient = useQueryClient();

const isShowConfirm = ref(false);

const { data: muscles } = muscleService.getAll();

const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);

const isFutureActivity = computed(() => !!(props.start && props.start > new Date()));
const isExercisesDone = computed(() => !props.exercises.some((exercise) => !exercise.isDone));

const { mutate: mutateDelete } = activityService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });
    toast.success(t('activity.deleted'));
    emit('delete');
  },
});

function createUserTemplate() {
  const exercises = generateActivityExercises(props.exercises);

  const template: IUserTemplate = {
    title: formatDate(props.start, locale.value),
    exercises: deleteTempId(exercises),
  };

  emit('createTemplate', template);
}

function createActivityClipboardText() {
  const text = `${formatDate(props.start, locale.value)}, ${t('duration')}: ${subtractDates(props.end, props.start, locale.value)}
${t('set.many')}: ${props.exercises.length}, ${t('failures')}: ${getToFailurePercent(props.exercises)}, ${t('rest')}: ${getRestPercent(props.exercises, locale.value, props.start, props.end)}.

${props.exercises
  .map((exercise, index) => {
    const weight = exercise.weight ? ` ${exercise.weight}${t('kg')}` : '';

    return `${index + 1}. ${exercise.exercise?.[localeField('title', locale.value)]} x${exercise.repeats}${weight} ${formatDuration(exercise.duration, locale.value)} ${exercise.isToFailure ? t('toFailure') : ''}\n`;
  })
  .join('')}`;

  return text;
}
</script>
