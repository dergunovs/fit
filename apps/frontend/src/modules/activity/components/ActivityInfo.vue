<template>
  <div :class="$style.info" :data-scrollable="props.isPopup" data-test="activity-info">
    <UiFlex gap="4" align="center" wrap>
      <ActivityTimeline
        v-if="props.isPopup && props.exercises[0].dateUpdated"
        :exercises="props.exercises"
        :start="props.start"
        data-test="activity-timeline"
      />

      <span data-test="activity-info-start">
        <IconDate width="16" height="16" /> {{ formatDate(props.start, 'ru') }}
      </span>

      <span v-if="isExercisesDone" data-test="activity-info-duration">
        <IconDuration width="16" height="16" /> {{ subtractDates(props.end, props.start) }}
      </span>

      <span>
        Подходы:
        <span data-test="activity-info-sets">{{ props.exercises.length }}</span
        ><template v-if="isExercisesDone"
          >, отказы: <span data-test="activity-info-to-failure-percent">{{ getToFailurePercent(props.exercises) }}</span
          >, отдых:
          <span data-test="activity-info-rest-percent">
            {{ getRestPercent(props.exercises, props.start, props.end) }}
          </span>
        </template>
      </span>

      <UiButton
        v-if="isExercisesDone"
        @click="copyActivityToClipboard(props.exercises, props.start, props.end)"
        layout="plain"
        data-test="activity-info-copy"
      >
        Копировать
      </UiButton>
    </UiFlex>

    <ExerciseMuscleGroupStatistics :exercises="props.exercises" data-test="activity-info-muscle-groups" />

    <UiFlex column>
      <ExerciseTitle
        v-for="(exercise, index) in props.exercises"
        :key="exercise._id"
        :exercise="exercise"
        :isHideTitle="isPrevExerciseSame(props.exercises, index, exercise.exercise?._id)"
        :isHideDuration="isFutureActivity"
        data-test="activity-info-exercise"
      />
    </UiFlex>

    <UiFlex justify="space-between">
      <UiButton
        v-if="isAuth && isPopup && !isFutureActivity"
        @click="router.push(`${URL_ACTIVITY_CREATE}?copy=${props.id}`)"
        data-test="activity-info-repeat"
      >
        Скопировать
      </UiButton>

      <UiButton
        v-if="isAuth && isPopup && isFutureActivity"
        @click="router.push(`${URL_ACTIVITY_EDIT}/${props.id}`)"
        data-test="activity-info-start"
      >
        Начать
      </UiButton>

      <UiButton
        v-if="isAuth && isPopup"
        @click="isShowConfirm = true"
        layout="secondary"
        data-test="activity-info-start"
      >
        Удалить
      </UiButton>
    </UiFlex>

    <UiModal v-model="isShowConfirm" isConfirm @confirm="mutateDelete(id)" width="360" data-test="activity-info-modal">
      Подтверждаете удаление?
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { API_ACTIVITY, API_ACTIVITY_CALENDAR, IExerciseDone } from 'fitness-tracker-contracts';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import { formatDate, subtractDates, isAuth, useQueryClient } from 'mhz-helpers';

import ActivityTimeline from '@/activity/components/ActivityTimeline.vue';
import ExerciseTitle from '@/exercise/components/ExerciseTitle.vue';
import ExerciseMuscleGroupStatistics from '@/exercise/components/ExerciseMuscleGroupStatistics.vue';
import IconDate from '@/common/icons/date.svg';
import IconDuration from '@/common/icons/duration.svg';

import { URL_ACTIVITY_CREATE, URL_ACTIVITY_EDIT } from '@/activity/constants';
import { copyActivityToClipboard, getRestPercent, getToFailurePercent } from '@/activity/helpers';
import { isPrevExerciseSame } from '@/exercise/helpers';
import { activityService } from '@/activity/services';

interface IProps {
  id: string;
  start: Date | null | string;
  end: Date | null | string;
  exercises: IExerciseDone[];
  isPopup?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ delete: [] }>();

const router = useRouter();
const queryClient = useQueryClient();

const isShowConfirm = ref(false);

const isFutureActivity = computed(() => !!(props.start && props.start > new Date()));
const isExercisesDone = computed(() => props.exercises.some((exercise) => exercise.isDone));

const { mutate: mutateDelete } = activityService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });
    toast.success('Занятие удалено');
    emit('delete');
  },
});
</script>

<style module lang="scss">
.info {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &[data-scrollable='true'] {
    max-height: 64dvh;
    overflow-y: auto;
  }
}
</style>
