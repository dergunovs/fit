<template>
  <div>
    <UserForm v-if="user" :user="user" data-test="user-form" />
  </div>
</template>

<script setup lang="ts">
import UserForm from '@/user/components/UserForm.vue';

import { userService } from '@/user/services';
import { useRouteId } from '@/common/composables';

const { id } = useRouteId('user');

const { data: user } = userService.getOne(id);
</script>
