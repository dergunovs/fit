<template>
  <div>
    <div :class="$style.background">
      <h1 :class="$style.h1">FiT - фитнес трекер домашних тренировок</h1>

      <UiFlex column gap="12">
        <div v-for="benefit in HERO_BENEFITS" :key="benefit" :class="$style.benefit" data-test="hero-benefit">
          {{ benefit }}
        </div>
      </UiFlex>

      <HeroBackground :class="$style.lines" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import HeroBackground from '@/common/images/hero.svg';

import { HERO_BENEFITS } from '@/common/constants';
</script>

<style module lang="scss">
.background {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 64px 32px;
  overflow: hidden;
  color: var(--color-white);
  background-image: linear-gradient(
    340deg,
    var(--color-accent-dark) 0%,
    var(--color-accent-dark) 20%,
    var(--color-accent) 100%
  );
  border-radius: 12px;
}

.h1 {
  z-index: 1;
  font-size: 2.5rem;
}

.benefit {
  z-index: 1;
  padding-left: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  border-left: 8px solid var(--color-accent);
}

.lines {
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.6;
}

@media (max-width: 960px) {
  .background {
    gap: 24px;
    padding: 48px 24px;
  }

  .h1 {
    font-size: 1.75rem;
  }

  .benefit {
    font-size: 1rem;
    line-height: 1.3;
  }

  .lines {
    right: auto;
    opacity: 0.4;
  }
}
</style>
