<template>
  <UiSpoiler :title="t('updatePassword')" v-model="isShowUpdatePassword">
    <UiFlex gap="12">
      <UiInput
        v-model="newPassword"
        :placeholder="t('password6Symbols')"
        isPassword
        data-test="user-form-update-password-input"
      />

      <UiButton
        :isDisabled="newPassword.length < 6"
        isNarrow
        @click="mutateUpdatePassword({ password: newPassword, id: props.id })"
        data-test="user-form-update-password-button"
      >
        {{ t('update') }}
      </UiButton>
    </UiFlex>
  </UiSpoiler>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiFlex, UiInput, UiSpoiler, toast } from 'mhz-ui';

import { userService } from '@/user/services';
import { useTI18n } from '@/common/composables';

interface IProps {
  id: string;
}

interface IEmit {
  updated: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t } = useTI18n();

const isShowUpdatePassword = ref(false);
const newPassword = ref('');

const { mutate: mutateUpdatePassword } = userService.updatePassword({
  onSuccess: async () => {
    toast.success(t('passwordUpdated'));
    newPassword.value = '';
    isShowUpdatePassword.value = false;

    emit('updated');
  },
});
</script>
