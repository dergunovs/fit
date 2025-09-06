<template>
  <div>
    <UiFlex column gap="32">
      <RouterLink :to="URL_USER_CREATE" data-test="add-user">{{ t('user.add') }}</RouterLink>

      <UserList :users="users" data-test="user-list" />

      <UiPagination
        v-show="users?.length"
        :page="page"
        :total="total"
        :lang="locale"
        @update="(value: number) => setPage(setPaginationPage(value, page))"
        data-test="user-list-pagination"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex, UiPagination } from 'mhz-ui';
import { usePagination, usePageNumber } from 'mhz-helpers';

import UserList from '@/user/components/UserList.vue';

import { userService } from '@/user/services';
import { URL_USER_CREATE } from '@/user/constants';
import { useTI18n } from '@/common/composables';

const { t, locale } = useTI18n();
const { page, setPage } = usePageNumber();

const { data } = userService.getMany(page);

const { data: users, total, setPaginationPage } = usePagination(data);
</script>
