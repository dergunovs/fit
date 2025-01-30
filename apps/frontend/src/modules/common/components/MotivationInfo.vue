<template>
  <UiFlex column gap="48">
    <UiFlex column gap="16">
      <div :class="$style.header">Лучшая тренировка - та, на которую ты пришел!</div>

      <UiFlex column>
        <div>
          Мотивация зажигает цель, а дисциплина ведёт к победе.
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5977566/" target="_blank" rel="noopener noreferrer nofollow"
            >Исследования</a
          >
          доказывают, что трекинг результатов улучшает достижение ваших спортивных целей.
        </div>

        <div>
          <b>Мотивация</b> даёт энергию и направление, чтобы двигаться вперёд. Она помогает начать действовать, даёт
          стимулы и причины для достижения целей.
        </div>

        <div>
          <b>Дисциплина</b> удерживает этот путь, помогает действовать систематично. Когда мотивация начинает угасать
          или сталкивается с препятствиями, дисциплина приходит на помощь.
        </div>
      </UiFlex>
    </UiFlex>

    <ImageMotivation :class="$style.image" />
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import ImageMotivation from '@/common/images/motivation.svg';
</script>

<style module lang="scss">
.header {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.image {
  align-self: center;
  max-width: 80%;
}

@media (max-width: 960px) {
  .image {
    max-width: 100%;
  }
}
</style>
