<template>
  <main :class="$style.main" :data-auth="isAuth">
    <RouterView
      @register="emit('register')"
      :class="$style.content"
      :data-auth="isAuth"
      data-test="layout-default-page"
    />
  </main>
</template>

<script setup lang="ts">
import { isAuth } from 'mhz-helpers';

interface IEmit {
  register: [];
}

const emit = defineEmits<IEmit>();

defineOptions({ name: 'LayoutDefault' });
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
