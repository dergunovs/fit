<template>
  <div>
    <UiFlex column gap="32">
      <ActivityAdminList :activities="activities" data-test="activities-list" />

      <UiPagination
        v-show="activities?.length"
        :page="page"
        :total="total"
        :lang="locale"
        @update="(value: number) => setPage(setPaginationPage(value, page))"
        data-test="activities-pagination"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { UiFlex, UiPagination } from 'mhz-ui';
import { usePageNumber, usePagination } from 'mhz-helpers';
import { TLocale } from 'fitness-tracker-contracts';

import ActivityAdminList from '@/activity/components/ActivityAdminList.vue';

import { activityService } from '@/activity/services';

const { locale } = useI18n<DefaultLocaleMessageSchema, TLocale>();

const { page, setPage } = usePageNumber();

const { data } = activityService.getMany(page);

const { data: activities, total, setPaginationPage } = usePagination(data);
</script>
