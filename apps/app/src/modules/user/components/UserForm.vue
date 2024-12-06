<template>
  <div>
    <UiFlex @submit.prevent="props.user?._id ? update() : submit()" tag="form" column gap="24" align="flex-start">
      <div v-if="formData.role === 'admin'" :class="$style.admin">Пользователь с правами администратора</div>

      <UiField label="Электронная почта" isRequired :error="error('email')">
        <UiInput v-model="formData.email" />
      </UiField>

      <UiField label="Имя" isRequired :error="error('firstName')">
        <UiInput v-model="formData.firstName" />
      </UiField>

      <UiField label="Фамилия" isRequired :error="error('lastName')">
        <UiInput v-model="formData.lastName" />
      </UiField>

      <UiField v-if="!props.user?._id" label="Пароль" isRequired :error="error('password')">
        <UiInput v-model="formData.password" />
      </UiField>

      <FormButtons :id="props.user?._id" :isLoading="isLoadingPost || isLoadingUpdate" @delete="handleDelete" />
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
import { postUser, updateUser, deleteUser } from '@/user/services';

interface IProps {
  user?: IUser;
}

const props = defineProps<IProps>();

const queryClient = useQueryClient();

const router = useRouter();

const formData = ref<IUser>({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: 'user',
});

const { mutate: mutatePost, isPending: isLoadingPost } = postUser({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success('Пользователь добавлен');
    router.push(URL_USER);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = updateUser({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success('Пользователь обновлен');
  },
});

const { mutate: mutateDelete } = deleteUser({
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
    firstName: required('ru'),
    lastName: required('ru'),
    password: !props.user?._id && required('ru'),
  };
});

const { error, isValid } = useValidator(formData, rules);

function submit() {
  if (isValid()) mutatePost(formData.value);
}

function update() {
  formData.value.role = 'admin';

  if (isValid()) mutateUpdate(formData.value);
}

function handleDelete(id: string) {
  mutateDelete(id);
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
