<template>
  <p>
    <span>{{ t('activity.potentialDuration') }}: </span>

    <span v-if="props.exercises && statistics" data-test="activity-potential-duration">
      {{
        getPotentialActivityDuration(
          props.exercises,
          locale,
          statistics.exercise,
          statistics.activity.averageRestPercent.cur
        )
      }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import { activityService } from '@/activity/services';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import { useTI18n } from '@/common/composables';
import { getPotentialActivityDuration } from '@/activity/helpers';

interface IProps {
  exercises: IExerciseChoosen[];
}

const props = defineProps<IProps>();

const { t, locale } = useTI18n();

const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);
</script>
