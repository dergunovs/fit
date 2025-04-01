<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="16" align="flex-start" data-test="user-form">
      <h2>Профиль пользователя</h2>

      <div v-if="props.user?.role === 'admin'" :class="$style.admin" data-test="user-form-admin">
        Пользователь с правами администратора
      </div>

      <div
        v-if="props.user?.isResetPassword && !isPasswordUpdated"
        :class="$style.reset"
        data-test="user-form-reset-password"
      >
        Установите новый пароль
      </div>

      <h3>Ваше оборудование</h3>

      <UserEquipmentForm
        v-if="equipments"
        :equipments="equipments"
        v-model="formData.equipments"
        data-test="user-form-equipments"
      />

      <slot></slot>

      <h3>Выбор веса по-умолчанию</h3>

      <UserDefaultWeightsForm
        v-if="formData.equipments && exercises"
        :userEquipments="formData.equipments"
        :exercises="exercises"
        v-model="formData.defaultWeights"
        data-test="user-form-default-weights"
      />

      <h3>Общие данные</h3>

      <UiField label="Имя" isRequired :error="error('name')">
        <UiInput v-model="formData.name" data-test="user-form-name" />
      </UiField>

      <UiField label="Электронная почта" isRequired :error="error('email')">
        <UiInput v-model="formData.email" type="email" data-test="user-form-email" />
      </UiField>

      <UiField v-if="!props.user?._id" label="Пароль" isRequired :error="error('password')">
        <UiInput v-model="formData.password" isPassword data-test="user-form-password" />
      </UiField>

      <UiSpoiler
        v-if="props.user?._id"
        title="Обновить пароль"
        v-model="isShowUpdatePassword"
        data-test="user-form-new-password-spoiler"
      >
        <UiFlex>
          <UiInput
            v-model="newPassword"
            placeholder="Новый пароль от 6 символов"
            isPassword
            data-test="user-form-new-password"
          />

          <UiButton
            :isDisabled="newPassword.length < 6"
            isNarrow
            @click="mutateUpdatePassword({ password: newPassword })"
            data-test="user-form-set-new-password"
          >
            Установить
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
  user?: IUser | null;
  isEdit?: boolean;
}

const props = defineProps<IProps>();

const router = useRouter();

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
    toast.success('Пользователь добавлен');
    router.push(URL_USER);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = userService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    await queryClient.refetchQueries({ queryKey: [API_AUTH_GET] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    toast.success('Пользователь обновлен');
  },
});

const { mutate: mutateUpdatePassword } = userService.updatePassword(
  {
    onSuccess: async () => {
      toast.success('Пароль обновлен');
      newPassword.value = '';
      isShowUpdatePassword.value = false;
      isPasswordUpdated.value = true;
    },
  },
  props.user?._id
);

const { mutate: mutateDelete } = userService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_USER] });
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success('Пользователь удален');

    if (isAdmin.value) {
      router.push(URL_USER);
    } else {
      logout(URL_HOME, deleteAuthHeader, TOKEN_NAME);
    }
  },
});

const { error, isValid } = useValidator(formData, {
  email: [required(), email()],
  name: [required(), letters()],
  password: !props.user?._id && [required(), min(6)],
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
