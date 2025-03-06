<template>
  <div>
    <UiFlex column>
      <ExercisePassingList
        v-if="props.activity.exercises?.length"
        :exercises="props.activity.exercises"
        :activeExerciseId="activeExerciseId"
        @start="startExercise"
        @stop="stopExercise"
        data-test="exercise-passing-list"
      />

      <div>
        <div>
          Занятие создано <span data-test="activity-start">{{ formatDateTime(props.activity.dateCreated, 'ru') }}</span
          >.
        </div>

        <div v-if="props.activity.dateUpdated">
          Занятие {{ formData.isDone ? 'закончено' : 'обновлено' }}
          <span data-test="activity-updated">{{ formatDateTime(props.activity.dateUpdated, 'ru') }}</span
          >.
        </div>
      </div>

      <UiButton
        @click="finishActivity"
        layout="secondary"
        :isDisabled="props.activity.isDone"
        data-test="activity-finish"
      >
        Завершить занятие досрочно
      </UiButton>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex } from 'mhz-ui';
import { formatDateTime, useQueryClient, clone } from 'mhz-helpers';
import {
  API_ACTIVITY,
  API_ACTIVITY_CHART,
  API_ACTIVITY_STATISTICS,
  IActivity,
  IExerciseDone,
} from 'fitness-tracker-contracts';

import ExercisePassingList from '@/exercise/components/ExercisePassingList.vue';

import { activityService } from '@/activity/services';
import { URL_HOME } from '@/common/constants';

interface IProps {
  activity: IActivity;
}

const props = defineProps<IProps>();

const formData = ref<IActivity>({
  exercises: [],
  dateCreated: undefined,
  dateUpdated: undefined,
  dateScheduled: undefined,
  isDone: false,
});

const activeExerciseId = ref<string>();

const router = useRouter();

const queryClient = useQueryClient();

const { mutate: mutateUpdate } = activityService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
  },
});

function startExercise(id: string) {
  activeExerciseId.value = id;
}

function stopExercise(exerciseDone: IExerciseDone) {
  activeExerciseId.value = undefined;

  formData.value.exercises = formData.value.exercises?.map((exercise) => {
    if (exercise._id === exerciseDone._id) {
      return {
        ...exercise,
        isDone: true,
        duration: exerciseDone.duration,
        isToFailure: exerciseDone.isToFailure,
        repeats: exerciseDone.repeats,
        dateUpdated: new Date(),
      };
    }

    return exercise;
  });

  formData.value.isDone = !formData.value.exercises?.some((exercise) => !exercise.isDone);

  if (!formData.value.dateUpdated) {
    formData.value.dateCreated = new Date(new Date().getTime() - (exerciseDone.duration || 0) * 1000);
  }

  formData.value.dateUpdated = new Date();

  mutateUpdate(formData.value);

  if (formData.value.isDone) exitActivity();
}

function finishActivity() {
  formData.value.isDone = true;

  mutateUpdate(formData.value);

  exitActivity();
}

function exitActivity() {
  toast.success('Занятие закончено');

  setTimeout(async () => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_CHART] });

    router.push(URL_HOME);
  }, 1000);
}

const screenLock = ref<WakeLockSentinel>();

onMounted(async () => {
  if (props.activity) formData.value = clone(props.activity);

  screenLock.value = await navigator.wakeLock?.request();
});

onBeforeUnmount(() => {
  screenLock.value?.release();
  screenLock.value = undefined;
});
</script>
