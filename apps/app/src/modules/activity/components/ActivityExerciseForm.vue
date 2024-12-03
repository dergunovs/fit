<template>
  <div>
    <UiFlex column>
      <ActivityExerciseList
        v-if="props.activity.exercises?.length"
        :exercises="props.activity.exercises"
        :activeExerciseId="activeExerciseId"
        :isActivityDone="formData.isDone"
        @start="startExercise"
        @stop="stopExercise"
      />

      <div>
        <div>Занятие началось {{ formatDateTime(props.activity.dateCreated, 'ru') }}.</div>

        <div v-if="props.activity.dateUpdated">
          Занятие {{ formData.isDone ? 'закончено' : 'обновлено' }}
          {{ formatDateTime(props.activity.dateUpdated, 'ru') }}.
        </div>
      </div>

      <UiButton @click="finishActivity" layout="secondary" :isDisabled="props.activity.isDone">
        Завершить досрочно
      </UiButton>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex } from 'mhz-ui';
import { formatDateTime, useQueryClient, clone } from 'mhz-helpers';
import { API_ACTIVITY, IActivity, IExerciseDone } from 'fitness-tracker-contracts';

import ActivityExerciseList from '@/activity/components/ActivityExerciseList.vue';

import { updateActivity } from '@/activity/services';
import { URL_HOME } from '@/common/constants';

interface IProps {
  activity: IActivity;
}

const props = defineProps<IProps>();

const formData = ref<IActivity>({
  exercises: [],
  isDone: false,
});

const activeExerciseId = ref<string>();

const router = useRouter();

const queryClient = useQueryClient();

const { mutate: mutateUpdate } = updateActivity({
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
      };
    }

    return exercise;
  });

  formData.value.isDone = !formData.value.exercises?.some((exercise) => !exercise.isDone);

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

  setTimeout(() => {
    router.push(URL_HOME);
  }, 2000);
}

onMounted(() => {
  if (props.activity) formData.value = clone(props.activity);
});
</script>
