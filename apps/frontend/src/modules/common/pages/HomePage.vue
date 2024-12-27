<template>
  <div>
    <h1>Фитнес трекер</h1>

    <div :class="$style.info">
      <div :class="$style.calendar">
        <ActivityCalendar :events="events" @ready="updateDates" @update="updateDates" data-test="activity-calendar" />
        <ActivityStatistics v-if="statistics" :statistics="statistics.activity" data-test="activity-statistics" />
        <ActivityChart />
      </div>

      <div :class="$style.statistics">
        <ExerciseStatistics v-if="statistics" :statistics="statistics.exercise" data-test="exercise-statistics" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ActivityChart from '@/activity/components/ActivityChart.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { activityService } from '@/activity/services';
import { useActivityCalendar, computedActivityCalendarEvents } from '@/activity/composables';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';

const { dateFrom, dateTo, isDatesReady, updateDates } = useActivityCalendar();

const { data: calendar } = activityService.getCalendar({ enabled: isDatesReady }, dateFrom, dateTo);
const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);

const events = computedActivityCalendarEvents(calendar);
</script>

<style module lang="scss">
.info {
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
  .info {
    flex-direction: column;
  }

  .calendar {
    width: 100%;
  }

  .statistics {
    width: 100%;
  }
}
</style>
