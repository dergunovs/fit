<template>
  <UiTable :headers="ACTIVITY_LIST_HEADERS" :isLoading="!props.activities?.length" lang="ru">
    <tr v-for="activity in props.activities" :key="activity._id" data-test="activity-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_ACTIVITY_ADMIN_EDIT}/${activity._id}`" data-test="activity-table-date-link">
          {{ formatDate(activity.dateCreated, 'ru') }}
        </RouterLink>
      </td>
      <td>
        <RouterLink :to="`${URL_USER_EDIT}/${activity.createdBy?._id}`" data-test="activity-table-user-link">
          {{ activity.createdBy?.email }}
        </RouterLink>
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { UiTable } from 'mhz-ui';
import { formatDate } from 'mhz-helpers';
import { IActivity } from 'fitness-tracker-contracts';

import { URL_ACTIVITY_ADMIN_EDIT, ACTIVITY_LIST_HEADERS } from '@/activity/constants';
import { URL_USER_EDIT } from '@/user/constants';

interface IProps {
  activities?: IActivity[];
}

const props = defineProps<IProps>();
</script>
