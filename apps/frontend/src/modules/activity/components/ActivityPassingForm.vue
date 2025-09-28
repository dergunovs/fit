<template>
  <div>
    <UiFlex column>
      <ExerciseRestTimer
        v-if="!activeExerciseId && currentExerciseIndex && currentExerciseIndex !== formData.exercises.length"
        data-test="activity-passing-form-rest-timer"
      />

      <ExerciseElementList
        :exercises="formData.exercises"
        isPassing
        :currentExerciseIndex="currentExerciseIndex"
        :activeExerciseId="activeExerciseId"
        @delete="deleteExercise"
        @setIndex="updateIndex"
        @setRepeats="
          (repeats, id) => (formData.exercises = updateExerciseField(formData.exercises, 'repeats', repeats, id))
        "
        @setWeight="
          (weight, id) => (formData.exercises = updateExerciseField(formData.exercises, 'weight', weight, id))
        "
        @setIsToFailure="
          (isToFailure, id) =>
            (formData.exercises = updateExerciseField(formData.exercises, 'isToFailure', isToFailure, id))
        "
        data-test="activity-passing-form-exercise-list"
      >
        <template #default="{ exercise, index }">
          <ExerciseElementPassing
            v-if="index === currentExerciseIndex"
            :exercise="exercise"
            :isActive="exercise._id === activeExerciseId"
            @start="(id) => (activeExerciseId = id)"
            @stop="stopExercise"
            data-test="activity-passing-form-exercise"
          />
        </template>
      </ExerciseElementList>

      <div>
        <div>
          {{ t('activity.created') }}
          <span data-test="activity-start"> {{ formatDateTime(formData.dateCreated, locale) }}</span>
        </div>
      </div>

      <UiButton
        v-if="!formData.isDone"
        @click="finishActivity"
        layout="secondary"
        :isDisabled="!!activeExerciseId"
        data-test="activity-finish"
      >
        {{ t('activity.finishEarly') }}
      </UiButton>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex } from 'mhz-ui';
import { clone, formatDateTime, useQueryClient } from 'mhz-helpers';
import {
  API_ACTIVITY,
  API_ACTIVITY_CHART,
  API_ACTIVITY_STATISTICS,
  IActivity,
  IExerciseDone,
} from 'fitness-tracker-contracts';

import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';
import ExerciseElementPassing from '@/exercise/components/ExerciseElementPassing.vue';
import ExerciseRestTimer from '@/exercise/components/ExerciseRestTimer.vue';

import { useTI18n } from '@/common/composables';
import { updateExerciseField, updateExercisesIndex } from '@/exercise/helpers';
import { URL_HOME } from '@/common/constants';
import { activityService } from '@/activity/services';

interface IProps {
  activity: IActivity;
}

const props = defineProps<IProps>();

const router = useRouter();
const { t, locale } = useTI18n();
const queryClient = useQueryClient();

const formData = ref<IActivity>({
  exercises: [],
  dateCreated: undefined,
  dateUpdated: undefined,
  isDone: false,
});

const activeExerciseId = ref<string>();

const currentExerciseIndex = computed(() => formData.value.exercises.filter((exercise) => exercise.isDone).length);

const { mutate: mutateUpdate } = activityService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
  },
});

function stopExercise(exerciseDone: IExerciseDone, duration: number) {
  activeExerciseId.value = undefined;

  const updatedExercises = formData.value.exercises.map((exercise) => {
    return exercise._id === exerciseDone._id
      ? { ...exercise, isDone: true, duration, dateUpdated: new Date() }
      : exercise;
  });

  formData.value.exercises = updatedExercises;

  formData.value.isDone = !formData.value.exercises.some((exercise) => !exercise.isDone);

  if (!formData.value.dateUpdated) {
    formData.value.dateCreated = new Date(Date.now() - (exerciseDone.duration || 0) * 1000);
  }

  formData.value.dateUpdated = new Date();

  if (formData.value.isDone) exitActivity();
}

function finishActivity() {
  formData.value.isDone = true;
  exitActivity();
}

function deleteExercise(idToDelete: string) {
  const updatedExercises = formData.value.exercises.filter((exercise) => exercise._id !== idToDelete);

  formData.value.exercises = updatedExercises;
}

function updateIndex(updatedIndex: number) {
  const updatedExercises = updateExercisesIndex(formData.value.exercises, updatedIndex);

  formData.value.exercises = updatedExercises;
}

function exitActivity() {
  mutateUpdate(formData.value);

  toast.success(t('activity.finished'));

  setTimeout(async () => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_CHART] });

    router.push(URL_HOME);
  }, 1000);
}

onBeforeMount(() => {
  formData.value = clone(props.activity);
});
</script>
