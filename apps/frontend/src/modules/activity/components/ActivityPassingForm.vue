<template>
  <div>
    <UiFlex column>
      <ExerciseRestTimer
        v-if="!activeExerciseId && currentExerciseIndex && currentExerciseIndex !== props.activity.exercises.length"
        data-test="activity-passing-form-rest-timer"
      />

      <ExerciseElementList
        :exercises="props.activity.exercises"
        isPassing
        @setRepeats="updateRepeats"
        @setWeight="updateWeight"
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
        <div>
          {{ t('activity.created') }}
          <span data-test="activity-start"> {{ formatDateTime(props.activity.dateCreated, locale) }}</span>
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
import { ref, computed } from 'vue';
import { UiButton, UiFlex } from 'mhz-ui';
import { formatDateTime } from 'mhz-helpers';
import { IActivity, IExerciseDone } from 'fitness-tracker-contracts';

import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';
import ExerciseElementPassing from '@/exercise/components/ExerciseElementPassing.vue';
import ExerciseRestTimer from '@/exercise/components/ExerciseRestTimer.vue';

import { useTI18n } from '@/common/composables';
import { updateExercisesRepeats, updateExercisesWeight } from '@/exercise/helpers';

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

const { t, locale } = useTI18n();

const activeExerciseId = ref<string>();

const currentExerciseIndex = computed(() => props.activity.exercises.filter((exercise) => exercise.isDone).length);

function startExercise(id: string) {
  activeExerciseId.value = id;
}

function stopExercise(exerciseDone: IExerciseDone, duration: number, isToFailure: boolean) {
  activeExerciseId.value = undefined;

  const updatedExercises = props.activity.exercises?.map((exercise) => {
    return exercise._id === exerciseDone._id
      ? {
          ...exercise,
          isDone: true,
          duration,
          isToFailure,
          dateUpdated: new Date(),
        }
      : exercise;
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

function updateRepeats(repeats: number, id?: string) {
  if (!id) return;

  const updatedExercises = updateExercisesRepeats(props.activity.exercises, repeats, id);

  emit('updateExercises', updatedExercises);
}

function updateWeight(weight: number, id?: string) {
  if (!id) return;

  const updatedExercises = updateExercisesWeight(props.activity.exercises, weight, id);

  emit('updateExercises', updatedExercises);
}
</script>
