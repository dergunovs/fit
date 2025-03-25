<template>
  <div>
    <UserForm v-if="user" :user="user" isEdit data-test="user-form" />
  </div>
</template>

<script setup lang="ts">
import { useRouteId } from 'mhz-helpers';

import UserForm from '@/user/components/UserForm.vue';

import { userService } from '@/user/services';

const { id } = useRouteId('user');

const { data: user } = userService.getOne({}, id);
</script>
