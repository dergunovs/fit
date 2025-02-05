<template>
  <UiFlex column>
    <h2 data-test="auth-form-header">{{ header }}</h2>

    <form @submit.prevent="submit" :class="$style.form" data-test="auth-form">
      <UiField label="Электронная почта" isRequired :error="error('email')">
        <UiInput v-model="formData.email" type="email" data-test="auth-form-email" />
      </UiField>

      <div>
        <UiField v-if="!isPasswordReset" label="Пароль" isRequired :error="error('password')">
          <UiInput v-model="formData.password" isPassword data-test="auth-form-password" />
        </UiField>

        <UiButton
          v-if="!props.isSetup"
          @click="isPasswordReset = !isPasswordReset"
          type="button"
          layout="plain"
          data-test="auth-form-password-reset-button"
        >
          Забыли пароль?
        </UiButton>

        <div v-if="isPasswordReset" data-test="auth-form-password-reset-info">
          Вышлем на почту новый пароль, который вы потом сможете поменять в профиле.
        </div>
      </div>

      <UiButton type="submit" data-test="auth-form-submit-button">{{ submitButton }}</UiButton>
    </form>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { UiFlex, UiButton, UiField, UiInput, toast } from 'mhz-ui';
import { useQueryClient, useAuth, setAuthHeader, useValidator, required, email, min } from 'mhz-helpers';
import {
  API_ACTIVITY_CALENDAR,
  API_ACTIVITY_CHART,
  API_ACTIVITY_STATISTICS,
  IAuthData,
  TPostAuthLoginDTO,
} from 'fitness-tracker-contracts';

import { authService } from '@/auth/services';
import { URL_HOME } from '@/common/constants';
import {
  TOKEN_NAME,
  AUTH_FORM_HEADER_SETUP,
  AUTH_FORM_HEADER_LOGIN,
  AUTH_FORM_HEADER_RESET,
  AUTH_FORM_SUBMIT_BUTTON_SETUP,
  AUTH_FORM_SUBMIT_BUTTON_LOGIN,
  AUTH_FORM_SUBMIT_BUTTON_RESET,
} from '@/auth/constants';
import { setAdmin } from '@/auth/composables';

interface IProps {
  isSetup?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ login: []; reset: [] }>();

const router = useRouter();
const queryClient = useQueryClient();

const { auth } = useAuth();

const formData = ref<IAuthData>({
  email: '',
  password: '',
});

const isPasswordReset = ref(false);

const header = computed(() => {
  if (props.isSetup) return AUTH_FORM_HEADER_SETUP;
  if (isPasswordReset.value) return AUTH_FORM_HEADER_RESET;

  return AUTH_FORM_HEADER_LOGIN;
});
const submitButton = computed(() => {
  if (props.isSetup) return AUTH_FORM_SUBMIT_BUTTON_SETUP;
  if (isPasswordReset.value) return AUTH_FORM_SUBMIT_BUTTON_RESET;

  return AUTH_FORM_SUBMIT_BUTTON_LOGIN;
});

const { mutate: mutateLogin } = authService.login({
  onSuccess: async (response: TPostAuthLoginDTO) => {
    if (!response.token) return;

    toast.success(
      response.user?.isResetPassword ? 'Установите новый пароль в профиле' : `Добро пожаловать, ${response.user?.name}!`
    );

    auth(response.token, setAuthHeader, TOKEN_NAME);
    if (response.user?.role === 'admin') setAdmin(true);
    emit('login');

    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_CALENDAR] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_CHART] });
  },
});

const { mutate: mutateSetup } = authService.setup({
  onSuccess: () => {
    toast.success('Администратор создан!');
    router.push(URL_HOME);
  },
});

const { mutate: mutateReset } = authService.resetPassword({
  onSuccess: () => {
    toast.success('Временный пароль выслан на почту!');
    emit('reset');
  },
});

const rules = computed(() => {
  return {
    email: [required('ru'), email('ru')],
    password: isPasswordReset.value && [required('ru'), min(6, 'ru')],
  };
});

const { error, isValid } = useValidator(formData, rules);

function submit() {
  if (!isValid()) return;

  if (props.isSetup) {
    mutateSetup(formData.value);
  } else if (isPasswordReset.value) {
    mutateReset({ email: formData.value.email });
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
