<template>
  <div>
    <AuthForm v-if="!isAuth" isSetup data-test="setup-page-auth-form" />
  </div>
</template>

<script setup lang="ts">
import { isAuth } from 'mhz-helpers';

import AuthForm from '@/auth/components/AuthForm.vue';
</script>
