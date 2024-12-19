<template>
  <div>
    <AuthForm isSetup data-test="setup-page-auth-form" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from 'mhz-helpers';

import AuthForm from '@/auth/components/AuthForm.vue';

import { URL_ACTIVITY_CREATE } from '@/activity/constants';

const { redirectIfAuth } = useAuth();

redirectIfAuth(URL_ACTIVITY_CREATE);
</script>
