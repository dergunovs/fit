<template>
  <div>
    <UserForm v-if="user" :user="user" data-test="user-form" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import UserForm from '@/user/components/UserForm.vue';

import { userService } from '@/user/services';
import { useAuthCheck } from '@/auth/composables';

const { token } = useAuthCheck();

console.log(token.value);

const id = computed(() => token.value?._id);

console.log(id.value);

const { data: user } = userService.getOne({ enabled: !!id.value }, id);
</script>
