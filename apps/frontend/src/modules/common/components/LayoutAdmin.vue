<template>
  <div :class="$style.layout">
    <TheHeader :isAdmin="props.isAdmin" />

    <div v-if="props.isAdmin" :class="$style.container" :data-auth="isAuth" data-test="layout-admin">
      <NavAdmin />

      <main :class="$style.main" :data-auth="isAuth">
        <RouterView :class="$style.content" :data-auth="isAuth" />
      </main>
    </div>

    <NavBottom v-if="isAuth" data-test="layout-admin-bottom-nav" />
  </div>
</template>

<script setup lang="ts">
import { isAuth } from 'mhz-helpers';

import TheHeader from '@/common/components/TheHeader.vue';
import NavAdmin from '@/common/components/NavAdmin.vue';
import NavBottom from '@/common/components/NavBottom.vue';

interface IProps {
  isAdmin: boolean;
}

const props = defineProps<IProps>();

defineOptions({ name: 'LayoutAdmin' });
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
