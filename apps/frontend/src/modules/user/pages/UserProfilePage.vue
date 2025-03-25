<template>
  <div>
    <UserForm v-if="user" :user="user" isEdit data-test="user-form" />
  </div>
</template>

<script setup lang="ts">
import UserForm from '@/user/components/UserForm.vue';

import { useAuthCheck } from '@/auth/composables';

const { user } = useAuthCheck();
</script>
