<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="16" data-test="user-form">
      <UserFormProfile
        v-if="props.user"
        :isAdmin="props.user.role === 'admin'"
        :isPasswordUpdated="isPasswordUpdated"
        :isResetPassword="props.user.isResetPassword"
        data-test="user-form-profile"
      />

      <UiTabs :tabs="TABS" v-model="currentTab" data-test="user-form-tabs" />

      <UserFormTab v-show="currentTab === 'general'" :title="t('user.general')" data-test="user-form-tab">
        <UiField :label="t('name')" isRequired :error="error('name')">
          <UiInput v-model="formData.name" data-test="user-form-name" />
        </UiField>

        <UiField :label="t('email')" isRequired :error="error('email')">
          <UiInput v-model="formData.email" type="email" data-test="user-form-email" />
        </UiField>

        <UiField v-if="!props.user" :label="t('password')" isRequired :error="error('password')">
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
      </UserFormTab>

      <UserFormTab v-show="currentTab === 'equipment'" :title="t('equipment.one')" data-test="user-form-tab">
        <UserEquipmentForm
          v-if="equipments"
          :equipments="equipments"
          v-model="formData.equipments"
          data-test="user-form-equipments"
        />
      </UserFormTab>

      <UserFormTab v-show="currentTab === 'weights'" :title="t('user.chooseWeights')" data-test="user-form-tab">
        <UserDefaultWeightsForm
          v-if="formData.equipments && exercises"
          :userEquipments="formData.equipments"
          :exercises="exercises"
          v-model="formData.defaultWeights"
          data-test="user-form-default-weights"
        />
      </UserFormTab>

      <UserFormTab v-show="currentTab === 'exercises'" :title="t('exercise.many')" data-test="user-form-tab">
        <UserExercises
          v-if="exercisesCustom?.length"
          :exercises="exercisesCustom"
          @edit="editExercise"
          data-test="user-form-exercises"
        />

        <UiButton @click="isShowCreateExercise = true" data-test="user-form-add-exercise">
          {{ t('exercise.addCustom') }}
        </UiButton>

        <UiModal v-model="isShowCreateExercise" width="360" data-test="user-form-exercise-form-modal">
          <div :class="$style.modal">
            <h3>{{ t('exercise.addCustom') }}</h3>

            <ExerciseForm
              :exercise="currentExercise"
              isDisableRedirect
              @hide="hideExerciseModal"
              data-test="user-form-exercise-form"
            />
          </div>
        </UiModal>
      </UserFormTab>

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
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { UiButton, UiField, UiFlex, UiInput, UiSpoiler, UiModal, toast, UiTabs } from 'mhz-ui';
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
import { API_ACTIVITY_STATISTICS, API_AUTH_GET, API_USER, IExercise, IUser } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';
import UserEquipmentForm from '@/user/components/UserEquipmentForm.vue';
import UserFormTab from '@/user/components/UserFormTab.vue';
import UserDefaultWeightsForm from '@/user/components/UserDefaultWeightsForm.vue';
import UserExercises from '@/user/components/UserExercises.vue';
import UserFormProfile from '@/user/components/UserFormProfile.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

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
const { data: exercisesCustom } = exerciseService.getCustom({ enabled: !isAdmin.value });

const formData = ref<IUser>({
  email: '',
  name: '',
  password: '',
  equipments: [],
  defaultWeights: {},
  role: 'user',
});

const generalTab = { value: 'general', title: t('user.general') };
const exercisesTab = { value: 'exercises', title: t('exercise.many') };

const otherTabs = [
  { value: 'equipment', title: t('equipment.one') },
  { value: 'weights', title: t('user.chooseWeights') },
];

const TABS = computed(() => {
  if (!props.user?._id) return [generalTab];
  if (isAdmin.value) return [generalTab, ...otherTabs];

  return [generalTab, ...otherTabs, exercisesTab];
});

const currentTab = ref(TABS.value[0].value);
const currentExercise = ref<IExercise>();

const isShowCreateExercise = ref(false);
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

function editExercise(exercise: IExercise) {
  currentExercise.value = exercise;
  isShowCreateExercise.value = true;
}

function hideExerciseModal() {
  currentExercise.value = undefined;
  isShowCreateExercise.value = false;
}

onMounted(() => {
  if (props.user) formData.value = clone(props.user);
});
</script>

<style module lang="scss">
.modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 64dvh;
  overflow-y: auto;
}
</style>
