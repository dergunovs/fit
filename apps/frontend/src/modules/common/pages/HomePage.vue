<template>
  <UiFlex column gap="64">
    <PromoBlocks v-if="!isAuth && calendar && statistics" data-test="promo" />

    <UiFlex column gap="16">
      <StatisticsExample v-if="!isAuth" />

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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiFlex } from 'mhz-ui';
import { isAuth, useRouteId } from 'mhz-helpers';

import PromoBlocks from '@/common/components/PromoBlocks.vue';
import StatisticsExample from '@/common/components/StatisticsExample.vue';
import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ActivityChart from '@/activity/components/ActivityChart.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { activityService } from '@/activity/services';
import { authService } from '@/auth/services';
import { useActivityCalendar } from '@/activity/composables';
import { convertActivityCalendarEvents } from '@/activity/helpers';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';

const { dateFrom, dateTo, isDatesReady, updateDates } = useActivityCalendar();

const { data: calendar } = activityService.getCalendar({ enabled: isDatesReady }, dateFrom, dateTo);
const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);

const router = useRouter();
const { id: token } = useRouteId('token', true);

const { mutate: mutateConfirm } = authService.confirmToken({
  onSuccess: () => {
    toast.success('Почта подтверждена. Войдите в приложение.');
    router.push(URL_HOME);
  },
});

onMounted(() => {
  document.querySelector('main')?.scrollTo(0, 0);

  setTimeout(() => {
    if (!isAuth.value && token.value) mutateConfirm({ token: token.value });
  }, 2000);
});
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
