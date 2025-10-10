<template>
  <div>
    <form v-if="!isSended" @submit.prevent="submit" :class="$style.form" data-test="feedback-form">
      <h3>{{ t('feedback') }}</h3>

      <UiField :label="t('name')" isRequired :error="error('name')">
        <UiInput v-model="formData.name" data-test="feedback-form-name" />
      </UiField>

      <UiField :label="t('email')" isRequired :error="error('email')">
        <UiInput v-model="formData.email" type="email" data-test="feedback-form-email" />
      </UiField>

      <UiField :label="t('message')" isRequired :error="error('message')">
        <UiTextarea v-model="formData.message" data-test="feedback-form-message" />
      </UiField>

      <UiButton type="submit" :isDisabled="isLoadingPost">{{ t('send') }}</UiButton>
    </form>

    <b v-else data-test="feedback-text">{{ t('feedbackText') }}</b>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiField, UiInput, UiTextarea, toast } from 'mhz-ui';
import { useQueryClient, useValidate, required, email } from 'mhz-helpers';
import { API_USER_FEEDBACK, IUserFeedback } from 'fitness-tracker-contracts';

import { userService } from '@/user/services';
import { useTI18n } from '@/common/composables';

const { t, locale } = useTI18n();
const queryClient = useQueryClient();

const formData = ref<IUserFeedback>({
  email: '',
  name: '',
  message: '',
});

const isSended = ref(false);

const { mutate: mutatePost, isPending: isLoadingPost } = userService.feedback({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER_FEEDBACK] });
    toast.success(t('sended'));
    isSended.value = true;
  },
});

const { error, isValid } = useValidate(
  formData,
  { name: [required], email: [required, email], message: [required] },
  locale.value
);

function submit() {
  if (!isValid()) return;

  mutatePost(formData.value);
}
</script>

<style module lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  max-width: 500px;
}
</style>
