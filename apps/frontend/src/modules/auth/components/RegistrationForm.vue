<template>
  <UiFlex column>
    <h2>{{ t('registration') }}</h2>

    <form @submit.prevent="submit" :class="$style.form" data-test="registration-form">
      <UiField :label="t('name')" isRequired :error="error('name')">
        <UiInput v-model="formData.name" data-test="registration-form-name" />
      </UiField>

      <UiField :label="t('email')" isRequired :error="error('email')">
        <UiInput v-model="formData.email" type="email" autocomplete="username" data-test="registration-form-email" />
      </UiField>

      <UiField :label="t('password')" isRequired :error="error('password')">
        <UiInput
          v-model="formData.password"
          isPassword
          autocomplete="new-password"
          data-test="registration-form-password"
        />
      </UiField>

      <UiButton type="submit">{{ t('register') }}</UiButton>
    </form>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { UiFlex, UiButton, UiField, UiInput, toast } from 'mhz-ui';
import { useValidator, required, email, min, letters } from 'mhz-helpers';
import { IRegisterData, TLocale } from 'fitness-tracker-contracts';

import { authService } from '@/auth/services';

interface IEmit {
  register: [];
}

const emit = defineEmits<IEmit>();

const { t, locale } = useI18n<DefaultLocaleMessageSchema, TLocale>();

const formData = ref<IRegisterData>({
  email: '',
  name: '',
  password: '',
});

const { mutate: mutateRegister } = authService.register(locale.value, {
  onSuccess: () => {
    emit('register');
    toast.success(t('followTheEmailLink'));
  },
});

const { error, isValid } = useValidator(
  formData,
  { email: [required, email], name: [required, min(2), letters], password: [required, min(6)] },
  locale.value
);

function submit() {
  if (!isValid()) return;

  mutateRegister(formData.value);
}
</script>

<style module lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 300px;
}
</style>
