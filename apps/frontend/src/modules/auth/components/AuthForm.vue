<template>
  <UiFlex column>
    <h2 data-test="auth-form-header">{{ header }}</h2>

    <form @submit.prevent="submit" :class="$style.form" data-test="auth-form">
      <UiField :label="t('email')" isRequired :error="error('email')">
        <UiInput v-model="formData.email" autocomplete="username" type="email" data-test="auth-form-email" />
      </UiField>

      <div>
        <UiField v-if="!isPasswordReset" :label="t('password')" isRequired :error="error('password')">
          <UiInput
            v-model="formData.password"
            isPassword
            autocomplete="current-password"
            data-test="auth-form-password"
          />
        </UiField>

        <UiButton
          v-if="!props.isSetup"
          @click="isPasswordReset = !isPasswordReset"
          type="button"
          layout="plain"
          data-test="auth-form-password-reset-button"
        >
          {{ t('forgotPassword') }}?
        </UiButton>

        <div v-if="isPasswordReset" data-test="auth-form-password-reset-info">
          {{ t('sendNewPasswordToEmail') }}
        </div>
      </div>

      <UiButton type="submit" data-test="auth-form-submit-button">{{ submitButton }}</UiButton>
    </form>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
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
import { TOKEN_NAME } from '@/auth/constants';
import { setAdmin } from '@/auth/composables';

interface IProps {
  isSetup?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ login: []; reset: [] }>();

const router = useRouter();
const { t, locale } = useI18n();
const queryClient = useQueryClient();

const { auth } = useAuth();

const formData = ref<IAuthData>({
  email: '',
  password: '',
});

const isPasswordReset = ref(false);

const header = computed(() => {
  if (props.isSetup) return t('createAdmin');
  if (isPasswordReset.value) return t('resetPassword');

  return t('login');
});

const submitButton = computed(() => {
  if (props.isSetup) return t('create');
  if (isPasswordReset.value) return t('sendNewPassword');

  return t('enter');
});

const { mutate: mutateLogin } = authService.login({
  onSuccess: async (response: TPostAuthLoginDTO) => {
    if (!response.token) return;

    toast.success(response.user?.isResetPassword ? t('setNewPassword') : `${t('welcome')}, ${response.user?.name}!`);

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
    toast.success(t('adminCreated'));
    router.push(URL_HOME);
  },
});

const { mutate: mutateReset } = authService.resetPassword(locale.value, {
  onSuccess: () => {
    toast.success(t('tempPasswordSent'));
    emit('reset');
  },
});

const { error, isValid } = useValidator(formData, {
  email: [required(locale.value), email(locale.value)],
  password: isPasswordReset.value && [required(locale.value), min(6, locale.value)],
});

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
