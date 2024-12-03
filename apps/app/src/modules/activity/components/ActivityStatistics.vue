<template>
  <div>
    <UiFlex column>
      <div>
        <b>Общие данные ({{ gap }} дн.)</b>
        <br />
        <span>
          Длительность: {{ formatDuration(props.activityStatistics.duration.cur)
          }}<DynamicPercent :percent="props.activityStatistics.duration.dynamics" />,
        </span>
        <span>
          занятия: {{ props.activityStatistics.activitiesCount.cur
          }}<DynamicPercent :percent="props.activityStatistics.activitiesCount.dynamics" />,
        </span>
        <span>
          сеты: {{ props.activityStatistics.setsCount.cur
          }}<DynamicPercent :percent="props.activityStatistics.setsCount.dynamics" />,
        </span>
        <span>
          повторы: {{ props.activityStatistics.repeatsCount.cur
          }}<DynamicPercent :percent="props.activityStatistics.repeatsCount.dynamics" />
        </span>
      </div>

      <div>
        <b>Средние значения</b>
        <br />
        <span>
          Длительность: {{ formatDuration(props.activityStatistics.averageDuration.cur)
          }}<DynamicPercent :percent="props.activityStatistics.averageDuration.dynamics" />,
        </span>
        <span>
          сетов в занятии: {{ props.activityStatistics.averageSetsPerActivity.cur
          }}<DynamicPercent :percent="props.activityStatistics.averageSetsPerActivity.dynamics" />,
        </span>
        <span>
          повторов в сете: {{ props.activityStatistics.averageRepeatsPerSet.cur
          }}<DynamicPercent :percent="props.activityStatistics.averageRepeatsPerSet.dynamics" />,
        </span>
        <span>
          отдых: {{ props.activityStatistics.averageRestPercent.cur }}%<DynamicPercent
            :percent="props.activityStatistics.averageRestPercent.dynamics"
          />
        </span>
      </div>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { IActivityStatistics } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';
import { formatDuration } from 'mhz-helpers';

import DynamicPercent from '@/common/components/DynamicPercent.vue';

interface IProps {
  activityStatistics: IActivityStatistics;
  gap: number;
}

const props = defineProps<IProps>();
</script>
