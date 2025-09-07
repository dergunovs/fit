<template>
  <UiFlex column gap="64">
    <PromoBlocks v-if="!isAuth && statistics" @register="emit('register')" data-test="promo" />

    <UiFlex column gap="16">
      <div :class="$style.main">
        <div v-if="statistics" :class="$style.calendar">
          <ActivityCalendar
            v-if="muscles"
            :events="convertActivityCalendarEvents(muscles, calendar)"
            @ready="updateDates"
            @update="updateDates"
            @deleteEvent="refetch"
            data-test="activity-calendar"
          />

          <ActivityStatistics :statistics="statistics.activity" data-test="activity-statistics" />

          <ActivityChart />
        </div>

        <div v-if="statistics" :class="$style.statistics">
          <ExerciseStatistics :statistics="statistics.exercise" data-test="exercise-statistics" />
        </div>
      </div>
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiFlex } from 'mhz-ui';
import { isAuth, scrollToTop, useRouteId, useCalendar } from 'mhz-helpers';

import PromoBlocks from '@/common/components/PromoBlocks.vue';
import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ActivityChart from '@/activity/components/ActivityChart.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { activityService } from '@/activity/services';
import { muscleService } from '@/muscle/services';
import { authService } from '@/auth/services';
import { convertActivityCalendarEvents } from '@/activity/helpers';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';
import { useTI18n } from '@/common/composables';

interface IEmit {
  register: [];
}

const emit = defineEmits<IEmit>();

const { dateFrom, dateTo, isDatesReady, updateDates } = useCalendar();

const { data: calendar, refetch } = activityService.getCalendar({ enabled: isDatesReady }, dateFrom, dateTo);
const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);
const { data: muscles } = muscleService.getAll();

const router = useRouter();
const { t } = useTI18n();
const { id: token } = useRouteId('token', true);

const { mutate: mutateConfirm } = authService.confirmToken({
  onSuccess: () => {
    toast.success(t('emailConfirmed'));
    router.push(URL_HOME);
  },
});

onMounted(() => {
  scrollToTop('main');

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
