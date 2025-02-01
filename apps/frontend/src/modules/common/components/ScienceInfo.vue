<template>
  <UiFlex column gap="64">
    <UiFlex column>
      <div :class="$style.header">Лучшая тренировка - та, на которую ты пришел!</div>

      <div>
        <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5977566/" target="_blank" rel="noopener noreferrer nofollow"
          >Исследования</a
        >
        доказывают, что трекинг результатов помогает достичь ваших спортивных целей. Научный подход к тренировкам
        основан на принципах физиологии, биомеханики и спортивной медицины. Например, доказано, что прогрессивная
        нагрузка стимулирует рост мышц и силы.
      </div>

      <div>
        Эффективные упражнения, рекомендованные экспертами, сгруппированы по группам мышц и подобраны для баланса
        простоты и разнообразия тренировок.
      </div>

      <div><b>Фиксация результатов тренировок — одна из лучших мотиваций продолжать заниматься фитнесом.</b></div>
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
