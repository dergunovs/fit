<template>
  <div>
    <UiFlex column>
      <div>
        <b>Общие данные ({{ props.gap }} дн.)</b>
        <br />
        <span>
          Длительность: {{ formatDuration(props.statistics.duration.cur)
          }}<DynamicPercent :percent="props.statistics.duration.dynamics" />,
        </span>
        <span>
          занятия: {{ props.statistics.activitiesCount.cur
          }}<DynamicPercent :percent="props.statistics.activitiesCount.dynamics" />,
        </span>
        <span>
          подходы: {{ props.statistics.setsCount.cur
          }}<DynamicPercent :percent="props.statistics.setsCount.dynamics" />,
        </span>
        <span>
          повторы: {{ props.statistics.repeatsCount.cur
          }}<DynamicPercent :percent="props.statistics.repeatsCount.dynamics" />
        </span>
      </div>

      <div>
        <b>Средние значения</b>
        <br />
        <span>
          Длительность: {{ formatDuration(props.statistics.averageDuration.cur)
          }}<DynamicPercent :percent="props.statistics.averageDuration.dynamics" />,
        </span>
        <span>
          подходов в занятии: {{ props.statistics.averageSetsPerActivity.cur
          }}<DynamicPercent :percent="props.statistics.averageSetsPerActivity.dynamics" />,
        </span>
        <span>
          повторов в подходе: {{ props.statistics.averageRepeatsPerSet.cur
          }}<DynamicPercent :percent="props.statistics.averageRepeatsPerSet.dynamics" />,
        </span>
        <span>
          отдых: {{ props.statistics.averageRestPercent.cur }}%<DynamicPercent
            :percent="props.statistics.averageRestPercent.dynamics"
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
  statistics: IActivityStatistics;
  gap: number;
}

const props = defineProps<IProps>();
</script>
