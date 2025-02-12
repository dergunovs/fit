<template>
  <UiTable :headers="USER_LIST_HEADERS" :isLoading="!props.users?.length">
    <tr v-for="user in props.users" :key="user._id" data-test="user-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_USER_EDIT}/${user._id}`" data-test="user-table-email-link">
          {{ user.email }}
        </RouterLink>
      </td>
      <td :class="$style.confirmed" :data-confirmed="user.isEmailConfirmed">
        {{ user.isEmailConfirmed ? 'Да' : 'Нет' }}
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { UiTable } from 'mhz-ui';
import { IUser } from 'fitness-tracker-contracts';

import { URL_USER_EDIT, USER_LIST_HEADERS } from '@/user/constants';

interface IProps {
  users?: IUser[];
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.confirmed {
  color: var(--color-success);

  &[data-confirmed='false'] {
    font-weight: 700;
    color: var(--color-error);
  }
}
</style>
