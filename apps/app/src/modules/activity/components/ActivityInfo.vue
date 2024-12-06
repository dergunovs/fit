<template>
  <div :class="$style.info" :data-scrollable="!props.isAdmin">
    <UiFlex gap="4" align="center" wrap>
      <span><IconDate width="16" height="16" /> {{ formatDate(props.start, 'ru') }}</span>
      <span><IconDuration width="16" height="16" /> {{ subtractDates(props.end, props.start) }}</span>
      <span>Подходы: {{ props.exercises.length }}, отказы: {{ toFailurePercent }}, отдых: {{ restPercent }}</span>
      <UiButton @click="copyToClipboard" layout="plain">Копировать</UiButton>
    </UiFlex>

    <div :class="$style.table">
      <UiTable :headers="ACTIVITY_STATISTICS_HEADERS" lang="ru">
        <tr v-for="muscleGroup in activityStatistics" :key="muscleGroup.title">
          <td>{{ muscleGroup.title }}</td>
          <td>{{ muscleGroup.sets }}</td>
          <td>{{ muscleGroup.repeats }}</td>
        </tr>
      </UiTable>
    </div>

    <UiFlex column>
      <ExerciseTitle
        v-for="(exercise, index) in props.exercises"
        :key="exercise._id"
        :exercise="exercise"
        :isHideTitle="isPrevExerciseSame(index, exercise.exercise?._id)"
      />
    </UiFlex>

    <UiButton v-if="isAuth && !isAdmin" @click="copyActivity">Сформировать такое же занятие</UiButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IExerciseDone, EXERCISE_MUSCLE_GROUPS, IMuscleGroup } from 'fitness-tracker-contracts';
import { toast, UiButton, UiFlex, UiTable } from 'mhz-ui';
import { formatDate, subtractDates, isAuth, formatDuration } from 'mhz-helpers';

import ExerciseTitle from '@/exercise/components/ExerciseTitle.vue';
import IconDate from '@/common/icons/date.svg';
import IconDuration from '@/common/icons/duration.svg';

import { URL_ACTIVITY_CREATE, ACTIVITY_STATISTICS_HEADERS } from '@/activity/constants';

interface IProps {
  id?: string;
  start?: Date | string;
  end?: Date | string;
  exercises: IExerciseDone[];
  isAdmin?: boolean;
}

interface IMuscleGroupStatistics {
  title: string;
  sets: number;
  repeats: number;
}

const props = defineProps<IProps>();

const router = useRouter();

const activityStatistics = computed(() => {
  const groups: IMuscleGroupStatistics[] = [];

  EXERCISE_MUSCLE_GROUPS.forEach((group: IMuscleGroup) => {
    const title = group.title;
    let sets = 0;
    let repeats = 0;

    props.exercises.forEach((exercise) => {
      const setsCount =
        exercise.exercise?.muscleGroups.filter((muscleGroup) => muscleGroup._id === group._id).length || 0;

      sets += setsCount;

      if (exercise.exercise?.muscleGroups.some((groupToFilter) => groupToFilter._id === group._id)) {
        repeats += exercise.repeats;
      }
    });

    if (sets) groups.push({ title, sets, repeats });
  });

  return groups.sort((a, b) => b.repeats - a.repeats);
});

const toFailurePercent = computed(() => {
  const allExercises = props.exercises.length;
  const toFailureExercises = props.exercises.filter((exercise) => exercise.isToFailure).length;

  return `${Math.floor((toFailureExercises / allExercises) * 100)}%`;
});

const restPercent = computed(() => {
  const activityDuration = Number(subtractDates(props.end, props.start, true));
  const exercisesDuration = props.exercises.reduce((acc, current) => acc + (current.duration || 0), 0);

  return `${Math.floor(100 - (exercisesDuration / activityDuration) * 100)}%`;
});

function isPrevExerciseSame(index: number, id?: string) {
  return id && props.exercises[index - 1] ? id === props.exercises[index - 1].exercise?._id : false;
}

function copyActivity() {
  router.push(`${URL_ACTIVITY_CREATE}?copy=${props.id}`);
}

async function copyToClipboard() {
  const textHeader = `${formatDate(props.start, 'ru')}, длительность: ${subtractDates(props.end, props.start)}
Подходы: ${props.exercises.length}, отказы: ${toFailurePercent.value}, отдых: ${restPercent.value}.

${props.exercises
  .map((exercise, index) => {
    return `${index + 1}. ${exercise.exercise?.title} x${exercise.repeats} ${exercise.weight ? `${exercise.weight}кг` : ''} ${formatDuration(exercise.duration)} ${exercise.isToFailure ? 'ДО ОТКАЗА' : ''}\n`;
  })
  .join('')}`;

  await navigator.clipboard.writeText(textHeader);
  toast.success('Скопировано в буфер');
}
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

.table {
  display: table;
}
</style>
