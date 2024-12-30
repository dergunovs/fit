<template>
  <div v-if="isShowForm">
    <h2>Сформировать занятие</h2>

    <UiFlex @submit.prevent="submit" tag="form" column gap="24">
      <p>Примерная длительность: {{ potentialActivityDuration }}</p>

      <UiButton @click="repeatLastActivity" layout="secondary">Повторить прошлое</UiButton>

      <UiButton @click="isShowModal = true">Добавить упражнение</UiButton>

      <UiModal v-model="isShowModal" width="380">
        <ExerciseChooseList v-if="exercises?.length" :exercises="exercises" @choose="addExercise" />
      </UiModal>

      <div v-if="formData.exercises?.length">
        <h3>Упражнения</h3>
        <ExerciseChoosenList :choosenExercises="formData.exercises" @delete="updateExercises" />
      </div>

      <UiButton layout="accent" :isDisabled="!isValid || isLoadingPost" type="submit">Начать</UiButton>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import { createTempId, deleteTempId, formatDuration, useQueryClient } from 'mhz-helpers';
import {
  API_ACTIVITY,
  IActivity,
  IExerciseChoosen,
  IExerciseDone,
  IExerciseStatistics,
  TPostActivityDTO,
} from 'fitness-tracker-contracts';

import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';

import { exerciseService } from '@/exercise/services';
import { activityService } from '@/activity/services';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { useRouteId } from '@/common/composables';

interface IProps {
  exerciseStatistics?: IExerciseStatistics[];
  averageRestPercent?: number;
}

const props = defineProps<IProps>();

const router = useRouter();

const { id } = useRouteId('copy', true);

const queryClient = useQueryClient();

const formData = ref<IActivity>({
  exercises: [],
  isDone: false,
});

const potentialActivityDuration = computed(() => {
  if (!props.averageRestPercent) return '-';

  const totalDuration = formData.value.exercises.reduce((acc, exercise) => {
    const averageDuration =
      props.exerciseStatistics?.find((choosenExericse) => choosenExericse._id === exercise.exercise?._id)
        ?.averageDuration || 0;

    return acc + averageDuration * exercise.repeats;
  }, 0);

  const durationWithRest = Math.round(totalDuration / (1 - props.averageRestPercent / 100));

  return formatDuration(durationWithRest);
});

const isShowModal = ref(false);
const isShowForm = ref(true);

const { data: exercises } = exerciseService.getAll();
const { data: lastActivity } = activityService.getLast();
const { data: activity } = activityService.getOne({ enabled: !!id.value }, id);

watch(
  () => activity.value,
  () => {
    if (activity.value) formData.value.exercises = generateExercises(activity.value?.exercises);
  }
);

function addExercise(exercise: IExerciseChoosen) {
  formData.value.exercises = formData.value.exercises?.length ? [...formData.value.exercises, exercise] : [exercise];

  isShowModal.value = false;
}

function updateExercises(idToUpdate: string) {
  formData.value.exercises = formData.value.exercises.filter((exercise) => exercise._id !== idToUpdate);
}

const { mutate: mutatePost, isPending: isLoadingPost } = activityService.create({
  onSuccess: async (activityId: TPostActivityDTO) => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
    toast.success('Занятие начато');
    router.push(`${URL_ACTIVITY_EDIT}/${activityId}`);
  },
});

const isValid = computed(() => !!formData.value.exercises?.length);

function submit() {
  if (isValid.value) {
    isShowForm.value = false;
    if (formData.value.exercises) formData.value.exercises = deleteTempId(formData.value.exercises);
    mutatePost(formData.value);
  }
}

function generateExercises(exercisesDone: IExerciseDone[]) {
  const lastActivityExercises = exercisesDone.map((exercise) => {
    return {
      _id: createTempId(),
      exercise: {
        _id: exercise.exercise?._id,
        title: exercise.exercise?.title || '',
        muscleGroups: exercise.exercise?.muscleGroups || [],
      },
      repeats: exercise.repeats,
      weight: exercise.weight,
    };
  });

  return lastActivityExercises?.length ? [...lastActivityExercises] : [];
}

function repeatLastActivity() {
  if (!lastActivity.value) return;

  formData.value.exercises = generateExercises(lastActivity.value.exercises);
}

onMounted(() => {
  if (activity.value) formData.value.exercises = generateExercises(activity.value?.exercises);
});
</script>
