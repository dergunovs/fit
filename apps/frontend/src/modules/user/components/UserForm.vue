<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="16" align="flex-start" data-test="user-form">
      <h2>{{ t('user.profile') }}</h2>

      <div v-if="props.user?.role === 'admin'" :class="$style.admin" data-test="user-form-admin">
        {{ t('user.admin') }}
      </div>

      <div
        v-if="props.user?.isResetPassword && !isPasswordUpdated"
        :class="$style.reset"
        data-test="user-form-reset-password"
      >
        {{ t('setNewPassword') }}
      </div>

      <h3>{{ t('user.equipment') }}</h3>

      <UserEquipmentForm
        v-if="equipments"
        :equipments="equipments"
        v-model="formData.equipments"
        data-test="user-form-equipments"
      />

      <slot></slot>

      <h3>{{ t('user.defaultWeights') }}</h3>

      <UserDefaultWeightsForm
        v-if="formData.equipments && exercises"
        :userEquipments="formData.equipments"
        :exercises="exercises"
        v-model="formData.defaultWeights"
        data-test="user-form-default-weights"
      />

      <h3>{{ t('user.generalInfo') }}</h3>

      <UiField :label="t('name')" isRequired :error="error('name')">
        <UiInput v-model="formData.name" data-test="user-form-name" />
      </UiField>

      <UiField :label="t('email')" isRequired :error="error('email')">
        <UiInput v-model="formData.email" type="email" data-test="user-form-email" />
      </UiField>

      <UiField v-if="!props.user?._id" :label="t('password')" isRequired :error="error('password')">
        <UiInput v-model="formData.password" isPassword data-test="user-form-password" />
      </UiField>

      <UiSpoiler
        v-if="props.user?._id"
        :title="t('updatePassword')"
        v-model="isShowUpdatePassword"
        data-test="user-form-new-password-spoiler"
      >
        <UiFlex>
          <UiInput
            v-model="newPassword"
            :placeholder="t('password6Symbols')"
            isPassword
            data-test="user-form-new-password"
          />

          <UiButton
            :isDisabled="newPassword.length < 6"
            isNarrow
            @click="mutateUpdatePassword({ password: newPassword, id: props.user._id })"
            data-test="user-form-set-new-password"
          >
            {{ t('update') }}
          </UiButton>
        </UiFlex>
      </UiSpoiler>

      <FormButtons
        :id="props.user?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        :isEdit="props.isEdit"
        @delete="(id) => mutateDelete(id)"
        data-test="user-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { UiButton, UiField, UiFlex, UiInput, UiSpoiler, toast } from 'mhz-ui';
import {
  useQueryClient,
  useValidator,
  required,
  email,
  clone,
  logout,
  deleteAuthHeader,
  letters,
  min,
} from 'mhz-helpers';
import { API_ACTIVITY_STATISTICS, API_AUTH_GET, API_USER, IUser } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';
import UserEquipmentForm from '@/user/components/UserEquipmentForm.vue';
import UserDefaultWeightsForm from '@/user/components/UserDefaultWeightsForm.vue';

import { URL_USER } from '@/user/constants';
import { userService } from '@/user/services';
import { equipmentService } from '@/equipment/services';
import { exerciseService } from '@/exercise/services';
import { URL_HOME } from '@/common/constants';
import { TOKEN_NAME } from '@/auth/constants';
import { isAdmin } from '@/auth/composables';

interface IProps {
  user?: IUser;
  isEdit?: boolean;
}

const props = defineProps<IProps>();

const router = useRouter();
const { t, locale } = useI18n();
const queryClient = useQueryClient();

const { data: equipments } = equipmentService.getAll();

const { data: exercises } = exerciseService.getAll();

const formData = ref<IUser>({
  email: '',
  name: '',
  password: '',
  equipments: [],
  defaultWeights: {},
  role: 'user',
});

const isShowUpdatePassword = ref(false);
const isPasswordUpdated = ref(false);

const newPassword = ref('');

const { mutate: mutatePost, isPending: isLoadingPost } = userService.create({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success(t('user.added'));
    router.push(URL_USER);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = userService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    await queryClient.refetchQueries({ queryKey: [API_AUTH_GET] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    toast.success(t('user.updated'));
  },
});

const { mutate: mutateUpdatePassword } = userService.updatePassword({
  onSuccess: async () => {
    toast.success(t('passwordUpdated'));
    newPassword.value = '';
    isShowUpdatePassword.value = false;
    isPasswordUpdated.value = true;
  },
});

const { mutate: mutateDelete } = userService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_USER] });
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success(t('user.deleted'));

    if (isAdmin.value) {
      router.push(URL_USER);
    } else {
      logout(URL_HOME, deleteAuthHeader, TOKEN_NAME);
    }
  },
});

const { error, isValid } = useValidator(formData, {
  email: [required(locale.value), email(locale.value)],
  name: [required(locale.value), letters(locale.value)],
  password: !props.user?._id && [required(locale.value), min(6, locale.value)],
});

function submit() {
  if (!isValid()) return;

  if (props.user?._id) {
    mutateUpdate(formData.value);
  } else {
    mutatePost(formData.value);
  }
}

onMounted(() => {
  if (props.user) formData.value = clone(props.user);
});
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
