<template>
  <UiFlex column gap="16">
    <h3 data-test="user-form-tab-title">{{ props.title }}</h3>

    <slot></slot>
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

interface IProps {
  title: string;
}

const props = defineProps<IProps>();
</script>
