<template>
  <div>
    <UiTable :headers="EXERCISE_STATISTICS_HEADERS" :lang="locale">
      <tr v-for="exercise in props.statistics" :key="exercise.exercise._id" data-test="exercise-statistics-table-row">
        <td>
          <UiButton
            @click="showExercise(exercise)"
            layout="plain"
            isWrap
            data-test="exercise-statistics-title"
            :class="$style.title"
            :data-equipment="isAuth ? exercise.isUserEquipmentMatches : true"
            :data-custom="exercise.exercise.isCustom"
          >
            {{ exercise.exercise[localeField('title', locale)] }}
          </UiButton>
        </td>
        <td>
          <div :class="$style.cell">
            <div :class="$style.count" data-test="exercise-statistics-sets-count">
              {{ exercise.sets }}<DynamicPercent :percent="exercise.setsDynamics" />
            </div>
            <div :class="$style.duration" data-test="exercise-statistics-sets-duration">
              {{ getAverageDuration(exercise, 'set') }}{{ t('sec') }}
            </div>
          </div>
        </td>
        <td>
          <div :class="$style.cell">
            <div :class="$style.count" data-test="exercise-statistics-repeats-count">
              {{ exercise.repeats }}<DynamicPercent :percent="exercise.repeatsDynamics" />
            </div>
            <div :class="$style.duration" data-test="exercise-statistics-repeats-in-set">
              {{ getAverageRepeatsInSet(exercise.repeats, exercise.sets) }}
            </div>
          </div>
        </td>
      </tr>
    </UiTable>

    <UiModal v-model="isShowModal" width="360" data-test="exercise-statistics-modal">
      <ExerciseInfo v-if="currentExercise" :exercise="currentExercise" data-test="exercise-statistics-info" />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { IExerciseStatistics } from 'fitness-tracker-contracts';
import { UiTable, UiButton, UiModal } from 'mhz-ui';
import { isAuth, localeField } from 'mhz-helpers';

import ExerciseInfo from '@/exercise/components/ExerciseInfo.vue';
import DynamicPercent from '@/common/components/DynamicPercent.vue';

import { getAverageDuration, getAverageRepeatsInSet } from '@/exercise/helpers';

interface IProps {
  statistics: IExerciseStatistics[];
}

const props = defineProps<IProps>();

const { t, locale } = useI18n();

const isShowModal = ref(false);

const currentExercise = ref<IExerciseStatistics>();

const EXERCISE_STATISTICS_HEADERS = computed(() => [
  { title: t('exercise.one') },
  { title: t('set.many') },
  { title: t('repeat.many') },
]);

function showExercise(exercise: IExerciseStatistics) {
  currentExercise.value = exercise;

  isShowModal.value = true;
}
</script>

<style module lang="scss">
.cell {
  display: flex;
  gap: 4px;
}

.title {
  &[data-equipment='false'] {
    color: var(--color-gray-dark);
  }

  &[data-custom='true'] {
    font-weight: 700;
  }
}

.count {
  display: flex;
  flex-wrap: nowrap;
}

.duration {
  align-self: flex-end;
  font-size: 0.875rem;
  color: var(--color-gray-dark-extra);
}

@media (max-width: 960px) {
  .cell {
    flex-direction: column;
  }

  .duration {
    align-self: flex-start;
  }
}
</style>
