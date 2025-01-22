<template>
  <div :class="$style.layout">
    <TheHeader :isAdmin="props.isAdmin" />

    <div :class="$style.container" v-if="props.isAdmin" data-test="layout-admin">
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

interface IProps {
  isAdmin: boolean;
}

const props = defineProps<IProps>();

defineOptions({ name: 'LayoutAdmin' });
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
