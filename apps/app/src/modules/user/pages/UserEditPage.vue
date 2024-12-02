<template>
  <div>
    <UserForm v-if="user" :user="user" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import UserForm from '@/user/components/UserForm.vue';

import { getUser } from '@/user/services';

const route = useRoute();

const userId = computed(() => route.params.user.toString());

const { data: user } = getUser(userId);
</script>
