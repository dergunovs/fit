<template>
  <UiTable :headers="ACTIVITY_LIST_HEADERS" :isLoading="!props.activities?.length" :lang="locale">
    <tr v-for="activity in props.activities" :key="activity._id" data-test="activity-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_ACTIVITY_ADMIN_EDIT}/${activity._id}`" data-test="activity-table-date-link">
          {{ formatDate(activity.dateCreated, locale) }}
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { UiTable } from 'mhz-ui';
import { formatDate } from 'mhz-helpers';
import { IActivity } from 'fitness-tracker-contracts';

import { URL_ACTIVITY_ADMIN_EDIT } from '@/activity/constants';
import { URL_USER_EDIT } from '@/user/constants';

interface IProps {
  activities?: IActivity[];
}

const props = defineProps<IProps>();

const { t, locale } = useI18n();

const ACTIVITY_LIST_HEADERS = computed(() => [{ title: t('created') }, { title: t('user.one') }]);
</script>
