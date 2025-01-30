<template>
  <UiFlex column gap="64">
    <PromoBlocks v-if="!isAuth" data-test="promo" />

    <UiFlex column gap="16">
      <UiFlex v-if="!isAuth" column>
        <div>
          Ниже пример пользовательских данных. В календаре можно открыть тренировку и посмотреть визуализацию, состав,
          время подходов. Можно скопировать информацию о тренировке в буфер обмена, например, для отчёта своему тренеру.
        </div>

        <div>
          Ниже общие и средние данные за месяц по длительности тренировок, количеству занятий, подходов, повторов,
          среднему времени отдыха. На графиках динамика по занятиям, подходам, повторам и группам мышц.
        </div>

        <div>
          В таблице статистика по упраженениям: количество выполненных подходов и повторов за последний месяц, динамика
          по сравнению с прошлым месяцем, среднее время выполнения. Кликнув по упражнению можно почитать о
          задействованных группах мышц, требуемом оборудовании и о технике выполнения.
        </div>
      </UiFlex>

      <div :class="$style.main">
        <div :class="$style.calendar">
          <ActivityCalendar
            :events="convertActivityCalendarEvents(calendar)"
            @ready="updateDates"
            @update="updateDates"
            data-test="activity-calendar"
          />

          <ActivityStatistics v-if="statistics" :statistics="statistics.activity" data-test="activity-statistics" />

          <ActivityChart />
        </div>

        <div :class="$style.statistics">
          <ExerciseStatistics v-if="statistics" :statistics="statistics.exercise" data-test="exercise-statistics" />
        </div>
      </div>
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { isAuth } from 'mhz-helpers';

import PromoBlocks from '@/common/components/PromoBlocks.vue';
import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ActivityChart from '@/activity/components/ActivityChart.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { activityService } from '@/activity/services';
import { useActivityCalendar } from '@/activity/composables';
import { convertActivityCalendarEvents } from '@/activity/helpers';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';

const { dateFrom, dateTo, isDatesReady, updateDates } = useActivityCalendar();

const { data: calendar } = activityService.getCalendar({ enabled: isDatesReady }, dateFrom, dateTo);
const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);
</script>

<style module lang="scss">
.main {
  display: flex;
  gap: 48px;
}

.calendar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 60%;
}

.statistics {
  width: 40%;
}

@media (max-width: 960px) {
  .main {
    flex-direction: column;
    gap: 24px;
  }

  .calendar {
    width: 100%;
  }

  .statistics {
    width: 100%;
  }
}
</style>
