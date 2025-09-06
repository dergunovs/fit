<template>
  <div :class="$style.features">
    <div v-for="feature in APP_FEATURES" :key="feature.title" :class="$style.feature" data-test="app-feature">
      <component :is="feature.icon" width="40" height="40" :class="$style.icon" />

      <div :class="$style.title" data-test="app-feature-title">{{ feature.title }}</div>
      <div data-test="app-feature-text">{{ feature.text }}</div>

      <FeatureBackground :class="$style.background" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import FeatureBackground from '@/common/images/feature-background.svg';

import IconShare from '@/common/icons/share.svg?component';
import IconProgress from '@/common/icons/to-failure.svg?component';
import IconPlan from '@/common/icons/activity.svg?component';

import { useTI18n } from '@/common/composables';

const { t } = useTI18n();

const APP_FEATURES = computed(() => [
  { icon: IconProgress, title: t('features.progressTitle'), text: t('features.progressText') },
  { icon: IconShare, title: t('features.shareTitle'), text: t('features.shareText') },
  { icon: IconPlan, title: t('features.planTitle'), text: t('features.planText') },
]);
</script>

<style module lang="scss">
.features {
  display: flex;
  gap: 32px;
}

.feature {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  padding: 32px;
  overflow: hidden;
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

.background {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  opacity: 0.1;
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
