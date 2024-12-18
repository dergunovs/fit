<template>
  <div>
    <h1>Фитнес трекер</h1>

    <div :class="$style.info">
      <div :class="$style.calendar">
        <ActivityCalendar :events="events" @ready="updateDates" @update="updateDates" />
        <ActivityStatistics v-if="statistics" :activityStatistics="statistics.activity" :gap="activityStatisticsGap" />
        <ActivityChart />
      </div>

      <div :class="$style.statistics">
        <ExerciseStatistics v-if="statistics" :exerciseStatistics="statistics.exercise" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IActivity, IExerciseDone } from 'fitness-tracker-contracts';

import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ActivityChart from '@/activity/components/ActivityChart.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { activityService } from '@/activity/services';
import { IActivityCalendarEvent, ICalendarEvent } from '@/activity/interface';

const dateFrom = ref('');
const dateTo = ref('');

const isRequestEnabled = ref(false);

const activityStatisticsGap = 21;

const { data } = activityService.getCalendar({ enabled: isRequestEnabled }, dateFrom, dateTo);
const { data: statistics } = activityService.getStatistics(activityStatisticsGap);

const events = computed<IActivityCalendarEvent<IExerciseDone>[] | undefined>(() =>
  data.value?.map((activity: IActivity) => {
    return {
      _id: activity._id,
      start: new Date(`${activity.dateCreated}`),
      end: new Date(`${activity.dateUpdated}`),
      title: '+',
      content: activity.exercises,
    };
  })
);

function updateDates(dates: ICalendarEvent) {
  isRequestEnabled.value = true;

  dateFrom.value = dates.firstCellDate;
  dateTo.value = dates.lastCellDate;
}
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
