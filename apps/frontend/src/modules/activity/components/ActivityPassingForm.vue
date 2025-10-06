<template>
  <div>
    <UiFlex column>
      <ExerciseRestTimer v-show="isShowRestTimer" :isActive="isShowRestTimer" data-test="activity-rest-timer" />

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
            @start="startExercise"
            @stop="stopExercise"
            data-test="activity-passing-form-exercise"
          />
        </template>
      </ExerciseElementList>

      <div>
        {{ t('activity.created') }}
        <span data-test="activity-start"> {{ formatDateTime(formData.dateCreated, locale) }}</span>
      </div>

      <UiFlex v-if="!formData.isDone" gap="4" justify="space-between">
        <UiButton
          @click="isShowExerciseModal = true"
          layout="secondary"
          isNarrow
          :isDisabled="!!activeExerciseId"
          data-test="activity-passing-add-exercise"
        >
          {{ t('exercise.add') }}
        </UiButton>

        <UiButton
          @click="finishActivity"
          layout="secondary"
          isNarrow
          :isDisabled="!!activeExerciseId"
          data-test="activity-finish"
        >
          {{ t('activity.finishEarly') }}
        </UiButton>
      </UiFlex>
    </UiFlex>

    <UiModal v-model="isShowExerciseModal" isScrollable data-test="activity-exercise-modal">
      <ExerciseChooseList
        v-if="exercisesAll?.length"
        :exercises="exercisesAll"
        @choose="addExercises"
        data-test="activity-exercise-choose-list"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import { clone, formatDateTime, useQueryClient, deleteTempId } from 'mhz-helpers';
import {
  API_ACTIVITY,
  API_ACTIVITY_CHART,
  API_ACTIVITY_STATISTICS,
  IActivity,
  IExerciseChoosen,
  IExerciseDone,
} from 'fitness-tracker-contracts';

import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';
import ExerciseElementPassing from '@/exercise/components/ExerciseElementPassing.vue';
import ExerciseRestTimer from '@/exercise/components/ExerciseRestTimer.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';

import { useTI18n } from '@/common/composables';
import { updateExerciseField, updateExercisesIndex } from '@/exercise/helpers';
import { URL_HOME } from '@/common/constants';
import { activityService } from '@/activity/services';
import { exerciseService } from '@/exercise/services';

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
  dateScheduled: undefined,
  isDone: false,
});

const activeExerciseId = ref<string>();
const isActivityStarted = ref(false);
const isShowExerciseModal = ref(false);

const { data: exercisesAll } = exerciseService.getAll();

const currentExerciseIndex = computed(() => formData.value.exercises.filter((exercise) => exercise.isDone).length);

const isShowRestTimer = computed(
  () =>
    !activeExerciseId.value &&
    !!currentExerciseIndex.value &&
    currentExerciseIndex.value !== formData.value.exercises.length
);

const { mutate: mutateUpdate } = activityService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
  },
});

function startExercise(id: string) {
  activeExerciseId.value = id;

  if (!isActivityStarted.value) {
    isActivityStarted.value = true;
    formData.value.dateCreated = new Date();
    formData.value.dateScheduled = undefined;
  }
}

function stopExercise(exerciseDone: IExerciseDone, duration: number) {
  formData.value.exercises = formData.value.exercises.map((exercise) => {
    return exercise._id === exerciseDone._id
      ? { ...exercise, isDone: true, duration, dateUpdated: new Date() }
      : exercise;
  });

  formData.value.dateUpdated = new Date();

  activeExerciseId.value = undefined;

  formData.value.isDone = !formData.value.exercises.some((exercise) => !exercise.isDone);

  if (formData.value.isDone) exitActivity();
}

function addExercises(exercises: IExerciseChoosen[]) {
  formData.value.exercises = [...formData.value.exercises, ...exercises];
  isShowExerciseModal.value = false;
}

function deleteExercise(idToDelete: string) {
  const updatedExercises = formData.value.exercises.filter((exercise) => exercise._id !== idToDelete);

  formData.value.exercises = updatedExercises;
}

function updateIndex(updatedIndex: number) {
  const updatedExercises = updateExercisesIndex(formData.value.exercises, updatedIndex);

  formData.value.exercises = updatedExercises;
}

function finishActivity() {
  formData.value.isDone = true;
  exitActivity();
}

function exitActivity() {
  formData.value.exercises = deleteTempId(formData.value.exercises);
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
