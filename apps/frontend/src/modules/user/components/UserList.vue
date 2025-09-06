<template>
  <UiTable :headers="USER_LIST_HEADERS" v-show="props.users?.length" :lang="locale">
    <tr v-for="user in props.users" :key="user._id" data-test="user-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_USER_EDIT}/${user._id}`" data-test="user-table-email-link">
          {{ user.email }}
        </RouterLink>
      </td>
      <td :class="$style.confirmed" :data-confirmed="user.isEmailConfirmed">
        {{ user.isEmailConfirmed ? t('yes') : t('no') }}
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UiTable } from 'mhz-ui';
import { IUser } from 'fitness-tracker-contracts';

import { URL_USER_EDIT } from '@/user/constants';
import { useTI18n } from '@/common/composables';

interface IProps {
  users?: IUser[];
}

const props = defineProps<IProps>();

const { t, locale } = useTI18n();

const USER_LIST_HEADERS = computed(() => [{ title: t('email') }, { title: t('confirmed') }]);
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
