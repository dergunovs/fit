<template>
  <UiFlex column gap="16" align="flex-start">
    <h2>{{ t('user.profile') }}</h2>

    <div v-if="props.isAdmin" :class="$style.admin" data-test="user-form-profile-admin">
      {{ t('user.admin') }}
    </div>

    <div
      v-if="props.isResetPassword && !isPasswordUpdated"
      :class="$style.reset"
      data-test="user-form-profile-reset-password"
    >
      {{ t('setNewPassword') }}
    </div>
  </UiFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { UiFlex } from 'mhz-ui';

interface IProps {
  isAdmin: boolean;
  isPasswordUpdated?: boolean;
  isResetPassword?: boolean;
}

const props = defineProps<IProps>();

const { t } = useI18n();
</script>

<style module lang="scss">
.admin {
  font-weight: 700;
  color: var(--color-success);
}

.reset {
  font-weight: 700;
  color: var(--color-error);
}
</style>
