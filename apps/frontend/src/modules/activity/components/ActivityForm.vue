<template>
  <div v-if="isShowForm" data-test="activity-form-container">
    <h2>Сформировать занятие</h2>

    <UiFlex @submit.prevent="submit" tag="form" column gap="24" data-test="activity-form">
      <p>
        <span>Примерная длительность: </span>

        <span v-if="formData.exercises" data-test="activity-form-potential-duration">
          {{ getPotentialActivityDuration(formData.exercises, props.exerciseStatistics, props.averageRestPercent) }}
        </span>
      </p>

      <UiButton @click="repeatLastActivity" layout="secondary" data-test="activity-form-repeat-last">
        Повторить прошлое
      </UiButton>

      <UiButton @click="isShowModal = true" data-test="activity-form-add-exercise">Добавить упражнение</UiButton>

      <UiModal v-model="isShowModal" width="380" data-test="activity-form-add-exercise-modal">
        <ExerciseChooseList
          v-if="exercises?.length"
          :exercises="exercises"
          @choose="addExercise"
          data-test="activity-form-exercise-choose-list"
        />
      </UiModal>

      <div v-if="formData.exercises?.length" data-test="activity-form-exercises-choosen-container">
        <h3>Упражнения</h3>

        <ExerciseChoosenList
          :choosenExercises="formData.exercises"
          @delete="deleteExercise"
          data-test="activity-form-exercises-choosen"
        />
      </div>

      <UiButton layout="accent" :isDisabled="!isValid || isLoadingPost" type="submit" data-test="activity-form-submit">
        Начать
      </UiButton>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import { deleteTempId, useQueryClient, useRouteId } from 'mhz-helpers';
import {
  API_ACTIVITY,
  IActivity,
  IExerciseChoosen,
  IExerciseStatistics,
  TPostActivityDTO,
} from 'fitness-tracker-contracts';

import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';

import { exerciseService } from '@/exercise/services';
import { activityService } from '@/activity/services';
import { getPotentialActivityDuration, generateActivityExercises } from '@/activity/helpers';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';

interface IProps {
  exerciseStatistics: IExerciseStatistics[];
  averageRestPercent: number;
}

const props = defineProps<IProps>();

const router = useRouter();

const { id } = useRouteId('copy', true);

const queryClient = useQueryClient();

const formData = ref<IActivity>({
  exercises: [],
  isDone: false,
});

const isShowModal = ref(false);
const isShowForm = ref(true);

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

function repeatLastActivity() {
  if (!lastActivity.value || !Object.keys(lastActivity.value).length) return;

  formData.value.exercises = generateActivityExercises(lastActivity.value.exercises);
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
  if (!isValid.value) return;

  isShowForm.value = false;
  formData.value.exercises = deleteTempId(formData.value.exercises);
  mutatePost(formData.value);
}
</script>
