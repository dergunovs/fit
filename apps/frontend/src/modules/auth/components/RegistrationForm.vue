<template>
  <UiFlex column>
    <h2>Регистрация</h2>

    <form @submit.prevent="submit" :class="$style.form" data-test="registration-form">
      <UiField label="Электронная почта" isRequired :error="error('email')">
        <UiInput v-model="formData.email" data-test="registration-form-email" />
      </UiField>

      <UiField label="Пароль" isRequired :error="error('password')">
        <UiInput v-model="formData.password" type="password" data-test="registration-form-password" />
      </UiField>

      <UiButton type="submit" data-test="registration-form-submit-button">Зарегистрироваться</UiButton>
    </form>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { UiFlex, UiButton, UiField, UiInput, toast } from 'mhz-ui';
import { useValidator, required, email } from 'mhz-helpers';
import { IAuthData } from 'fitness-tracker-contracts';

import { authService } from '@/auth/services';

const emit = defineEmits<{ register: [] }>();

const formData = ref<IAuthData>({
  email: '',
  password: '',
});

const { mutate: mutateSetup } = authService.register({
  onSuccess: () => {
    emit('register');
    toast.success('Перейдите по ссылке из почты!');
  },
});

const rules = computed(() => {
  return {
    email: [required('ru'), email('ru')],
    password: required('ru'),
  };
});

const { error, isValid } = useValidator(formData, rules);

function submit() {
  if (!isValid()) return;

  mutateSetup(formData.value);
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
