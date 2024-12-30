<template>
  <div>
    <h2 data-test="auth-form-header">{{ header }}</h2>

    <form @submit.prevent="submit" :class="$style.form" data-test="auth-form">
      <UiField label="Электронная почта" isRequired :error="error('email')">
        <UiInput v-model="formData.email" data-test="auth-form-email" />
      </UiField>

      <UiField label="Пароль" isRequired :error="error('password')">
        <UiInput v-model="formData.password" type="password" data-test="auth-form-password" />
      </UiField>

      <UiButton type="submit" data-test="auth-form-submit-button">{{ submitButton }}</UiButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { UiButton, UiField, UiInput, toast } from 'mhz-ui';
import { useAuth, setAuthHeader, useValidator, required, email } from 'mhz-helpers';
import { IAuthData, TPostAuthLoginDTO } from 'fitness-tracker-contracts';

import { authService } from '@/auth/services';
import { URL_HOME } from '@/common/constants';
import { URL_ACTIVITY_CREATE } from '@/activity/constants';
import {
  TOKEN_NAME,
  AUTH_FORM_HEADER_SETUP,
  AUTH_FORM_HEADER_LOGIN,
  AUTH_FORM_SUBMIT_BUTTON_SETUP,
  AUTH_FORM_SUBMIT_BUTTON_LOGIN,
} from '@/auth/constants';

interface IProps {
  isSetup?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ login: [] }>();

const router = useRouter();

const { auth } = useAuth();

const formData = ref<IAuthData>({
  email: '',
  password: '',
});

const header = computed(() => (props.isSetup ? AUTH_FORM_HEADER_SETUP : AUTH_FORM_HEADER_LOGIN));
const submitButton = computed(() => (props.isSetup ? AUTH_FORM_SUBMIT_BUTTON_SETUP : AUTH_FORM_SUBMIT_BUTTON_LOGIN));

const { mutate: mutateLogin } = authService.login({
  onSuccess: (user: TPostAuthLoginDTO) => {
    if (!user.token) return;

    toast.success(`Добро пожаловать, ${user.name}!`);
    auth(user.token, setAuthHeader, TOKEN_NAME);
    emit('login');
    router.push(URL_ACTIVITY_CREATE);
  },
});

const { mutate: mutateSetup } = authService.setup({
  onSuccess: () => {
    toast.success('Администратор создан!');
    router.push(URL_HOME);
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

  if (props.isSetup) {
    mutateSetup(formData.value);
  } else {
    mutateLogin(formData.value);
  }
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
