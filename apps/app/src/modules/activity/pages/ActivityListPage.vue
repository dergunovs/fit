<template>
  <div>
    <UiFlex column gap="32">
      <ActivityAdminList :activities="activities" />

      <UiPagination
        v-show="activities?.length"
        :page="page"
        :total="total"
        @update="(value: number) => setPage(setPaginationPage(value, page))"
        lang="ru"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex, UiPagination } from 'mhz-ui';
import { usePageNumber, usePagination } from 'mhz-helpers';

import ActivityAdminList from '@/activity/components/ActivityAdminList.vue';

import { activityService } from '@/activity/services';

const { page, setPage } = usePageNumber();

const { data } = activityService.getMany(page);

const { data: activities, total, setPaginationPage } = usePagination(data);
</script>
