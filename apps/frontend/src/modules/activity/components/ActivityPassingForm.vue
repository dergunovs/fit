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
          {{ t('activity.created') }}
          <span data-test="activity-start"> {{ formatDateTime(props.activity.dateCreated, locale) }}</span
          >.
        </div>

        <div v-if="props.activity.dateUpdated">
          {{ props.activity.isDone ? t('activity.finished') : t('activity.updated') }}
          <span data-test="activity-updated">{{ formatDateTime(props.activity.dateUpdated, locale) }}</span
          >.
        </div>
      </div>

      <UiButton
        v-if="!props.activity.isDone"
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
import { ref } from 'vue';
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { UiButton, UiFlex } from 'mhz-ui';
import { formatDateTime } from 'mhz-helpers';
import { IActivity, IExerciseDone, TLocale } from 'fitness-tracker-contracts';

import ExercisePassingList from '@/exercise/components/ExercisePassingList.vue';

interface IProps {
  activity: IActivity;
}

interface IEmit {
  exit: [];
  done: [isDone: boolean];
  updateExercises: [exercises: IExerciseDone[]];
  setDateCreated: [dateCreated: Date];
  setDateUpdated: [dateUpdated: Date];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useI18n<DefaultLocaleMessageSchema, TLocale>();

const activeExerciseId = ref<string>();

function startExercise(id: string) {
  activeExerciseId.value = id;
}

function stopExercise(exerciseDone: IExerciseDone) {
  activeExerciseId.value = undefined;

  const updatedExercises = props.activity.exercises?.map((exercise) => {
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

  emit('updateExercises', updatedExercises);

  emit('done', !props.activity.exercises?.some((exercise) => !exercise.isDone));

  if (!props.activity.dateUpdated) {
    emit('setDateCreated', new Date(Date.now() - (exerciseDone.duration || 0) * 1000));
  }

  emit('setDateUpdated', new Date());

  if (props.activity.isDone) emit('exit');
}

function finishActivity() {
  emit('done', true);
  emit('exit');
}
</script>
