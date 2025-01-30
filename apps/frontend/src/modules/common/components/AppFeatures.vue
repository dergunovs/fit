<template>
  <div :class="$style.features">
    <div v-for="feature in APP_FEATURES" :key="feature.title" :class="$style.feature" data-test="app-feature">
      <component :is="feature.icon" width="48" height="48" :class="$style.icon" />

      <div :class="$style.title" data-test="app-feature-title">{{ feature.title }}</div>
      <div data-test="app-feature-text">{{ feature.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_FEATURES } from '@/common/constants';
</script>

<style module lang="scss">
.features {
  display: flex;
  gap: 32px;
}

.feature {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  padding: 32px;
  border: 1px solid var(--color-gray);
  border-radius: 12px;
}

.icon {
  color: var(--color-primary);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  border-bottom: 4px solid;
}

@media (max-width: 960px) {
  .features {
    flex-direction: column;
  }

  .feature {
    padding: 24px;
  }
}
</style>
