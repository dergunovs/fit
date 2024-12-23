<template>
  <div :class="$style.layout">
    <TheHeader />

    <div :class="$style.container">
      <NavList />

      <main :class="$style.main">
        <RouterView :class="$style.content" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/common/components/TheHeader.vue';
import NavList from '@/common/components/NavList.vue';

defineOptions({ name: 'LayoutAdmin' });
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
