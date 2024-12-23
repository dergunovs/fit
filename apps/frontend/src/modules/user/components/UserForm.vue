<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="user-form">
      <div v-if="isAdmin" :class="$style.admin" data-test="user-form-admin">Пользователь с правами администратора</div>

      <UiField label="Электронная почта" isRequired :error="error('email')">
        <UiInput v-model="formData.email" data-test="user-form-email" />
      </UiField>

      <UiField label="Имя" isRequired :error="error('name')">
        <UiInput v-model="formData.name" data-test="user-form-name" />
      </UiField>

      <UiField v-if="!props.user?._id" label="Пароль" isRequired :error="error('password')">
        <UiInput v-model="formData.password" data-test="user-form-password" />
      </UiField>

      <FormButtons
        :id="props.user?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        @delete="(id) => mutateDelete(id)"
        data-test="user-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UiField, UiFlex, UiInput, toast } from 'mhz-ui';
import { useQueryClient, useValidator, required, email, clone } from 'mhz-helpers';
import { API_USER, IUser } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';

import { URL_USER } from '@/user/constants';
import { userService } from '@/user/services';

interface IProps {
  user?: IUser;
}

const props = defineProps<IProps>();

const queryClient = useQueryClient();

const router = useRouter();

const formData = ref<IUser>({
  email: '',
  name: '',
  password: '',
  role: 'user',
});

const isAdmin = computed(() => props.user?.role === 'admin');

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
    toast.success('Пользователь обновлен');
  },
});

const { mutate: mutateDelete } = userService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_USER] });
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success('Пользователь удален');
    router.push(URL_USER);
  },
});

const rules = computed(() => {
  return {
    email: [required('ru'), email('ru')],
    name: required('ru'),
    password: !props.user?._id && required('ru'),
  };
});

const { error, isValid } = useValidator(formData, rules);

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
</style>
