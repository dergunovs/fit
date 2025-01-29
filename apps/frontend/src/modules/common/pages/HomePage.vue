<template>
  <UiFlex column gap="64">
    <TheHero v-if="!isAuth" data-test="hero" />

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
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { isAuth } from 'mhz-helpers';

import TheHero from '@/common/components/TheHero.vue';
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
