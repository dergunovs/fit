<template>
  <UiFlex column gap="16">
    <h1>{{ t('help') }}</h1>

    <div>
      <p>
        {{ t('sourceCode') }}:
        <a href="https://github.com/dergunovs/fit" target="_blank" rel="nofollow noreferrer noopener">Github</a>
      </p>

      <p>
        {{ t('videoLinks') }}:
        <a href="https://vkvideo.ru/playlist/15313879_11" target="_blank" rel="nofollow noreferrer noopener">VK</a>,
        <a
          href="https://youtube.com/playlist?list=PLOICX-WjKEZcaT9VXzntq0inHwTBQKXkr"
          target="_blank"
          rel="nofollow noreferrer noopener"
          >Youtube</a
        >
      </p>

      <p>{{ t('emailLink') }}: mail@app-fit.ru</p>
    </div>

    <h3>{{ t('installation') }}</h3>

    <div>
      RuStore(Android):
      <a href="https://www.rustore.ru/catalog/app/com.appfit.dev" target="_blank" rel="nofollow noreferrer noopener">
        {{ t('installation') }}
      </a>
    </div>

    <div>
      <p v-for="(content, index) in tm('installText')" :key="index">
        {{ rt(content) }}
      </p>
    </div>

    <h3>{{ t('registration') }}</h3>

    <div>
      <p v-for="(content, index) in tm('registrationText')" :key="index">
        {{ rt(content) }}
      </p>
    </div>

    <h3>{{ t('activity.passing') }}</h3>

    <div>
      <p v-for="(content, index) in tm('activityPassingText')" :key="index">
        {{ rt(content) }}
      </p>
    </div>

    <UserFeedbackForm />
  </UiFlex>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { UiFlex } from 'mhz-ui';
import { scrollToTop } from 'mhz-helpers';

import UserFeedbackForm from '@/user/components/UserFeedbackForm.vue';

import { useTI18n } from '@/common/composables';

const { t, tm, rt } = useTI18n();

onMounted(() => scrollToTop('main'));
</script>
