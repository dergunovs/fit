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

      <UiTabs v-if="props.isEdit" :tabs="TABS" v-model="currentTab" data-test="user-form-tabs" />

      <UserFormTab
        v-show="currentTab === 'general'"
        :title="t('user.general')"
        :description="props.isEdit ? t('user.generalInfo') : ''"
        data-test="user-form-tab"
      >
        <UserEquipmentForm
          v-if="equipments && props.isEdit"
          :equipments="equipments"
          v-model="formData.equipments"
          data-test="user-form-equipments"
        />

        <UiField :label="t('name')" isRequired :error="error('name')">
          <UiInput v-model="formData.name" data-test="user-form-name" />
        </UiField>

        <UiField v-if="!props.isEdit" :label="t('email')" isRequired :error="error('email')">
          <UiInput v-model="formData.email" type="email" data-test="user-form-email" />
        </UiField>

        <UiField v-if="!props.isEdit" :label="t('password')" isRequired :error="error('password')">
          <UiInput v-model="formData.password" isPassword data-test="user-form-password" />
        </UiField>

        <UserFormUpdatePassword
          v-if="props.user?._id"
          :id="props.user._id"
          @updated="isPasswordUpdated = true"
          data-test="user-form-update-password"
        />
      </UserFormTab>

      <UserFormTab
        v-show="currentTab === 'goals'"
        :title="t('goals')"
        :description="t('user.goalsInfo')"
        data-test="user-form-tab"
      >
        <UiButtongroup
          v-model="formData.goalActivities"
          :options="USER_GOALS_OPTIONS.activities"
          :title="t('activity.many')"
          data-test="user-form-goals-activities"
        />

        <UiButtongroup
          v-model="formData.goalSets"
          :options="USER_GOALS_OPTIONS.sets"
          :title="t('set.many')"
          data-test="user-form-goals-sets"
        />

        <UiButtongroup
          v-model="formData.goalRepeats"
          :options="USER_GOALS_OPTIONS.repeats"
          :title="t('repeat.many')"
          data-test="user-form-goals-repeats"
        />

        <UiButtongroup
          v-model="formData.goalDuration"
          :options="USER_GOALS_OPTIONS.duration"
          :title="t('duration')"
          data-test="user-form-goals-duration"
        />
      </UserFormTab>

      <UserFormTab
        v-show="currentTab === 'weight'"
        :title="t('weight')"
        :description="t('user.weightsInfo')"
        data-test="user-form-tab"
      >
        <UserDefaultWeightsForm
          v-if="formData.equipments && exercises"
          :userEquipments="formData.equipments"
          :exercises="exercises"
          v-model="formData.defaultWeights"
          data-test="user-form-default-weights"
        />
      </UserFormTab>

      <UserFormTab
        v-show="currentTab === 'templates'"
        :title="t('template.many')"
        :description="t('user.templatesInfo')"
        data-test="user-form-tab"
      >
        <UiButton @click="addTemplate" data-test="user-form-add-template">{{ t('template.add') }}</UiButton>

        <UserFormTemplateList
          v-if="formData.templates?.length"
          :templates="formData.templates"
          @edit="editTemplate"
          @delete="deleteTemplate"
          data-test="user-form-template-list"
        />

        <UiModal v-model="isShowTemplateModal" isScrollable data-test="user-form-template-modal-container">
          <UserFormTemplateModal
            :template="currentTemplate"
            @create="createTemplate"
            @edit="saveTemplate"
            @delete="deleteTemplate"
            data-test="user-form-template-modal"
          />
        </UiModal>
      </UserFormTab>

      <UserFormTab
        v-show="currentTab === 'exercises'"
        :title="t('exercise.many')"
        :description="t('user.exercisesInfo')"
        data-test="user-form-tab"
      >
        <UiButton @click="createExercise" data-test="user-form-add-exercise">
          {{ t('exercise.addCustom') }}
        </UiButton>

        <UserExercises
          v-if="exercisesCustom?.length"
          :exercises="exercisesCustom"
          @edit="editExercise"
          data-test="user-form-exercises"
        />

        <UiModal v-model="isShowCreateExercise" isScrollable data-test="user-form-exercise-form-modal">
          <ExerciseForm
            :exercise="currentExercise"
            isDisableRedirect
            :isFixed="false"
            :isEdit="!!currentExercise?._id"
            @hide="hideExerciseModal"
            data-test="user-form-exercise-form"
          />
        </UiModal>
      </UserFormTab>

      <FormButtons
        :id="props.user?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        :isEdit="props.isEdit"
        isFixed
        @delete="(id) => mutateDelete(id)"
        data-test="user-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { UiButton, UiField, UiFlex, UiInput, UiModal, toast, UiTabs, UiButtongroup } from 'mhz-ui';
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
  createTempId,
  deleteTempId,
} from 'mhz-helpers';
import {
  API_ACTIVITY_CHART,
  API_ACTIVITY_STATISTICS,
  API_AUTH_GET,
  API_USER,
  IExercise,
  IUserTemplate,
  IUser,
} from 'fitness-tracker-contracts';

import UserEquipmentForm from '@/user/components/UserEquipmentForm.vue';
import UserFormTab from '@/user/components/UserFormTab.vue';
import UserDefaultWeightsForm from '@/user/components/UserDefaultWeightsForm.vue';
import UserExercises from '@/user/components/UserExercises.vue';
import UserFormProfile from '@/user/components/UserFormProfile.vue';
import UserFormUpdatePassword from '@/user/components/UserFormUpdatePassword.vue';
import UserFormTemplateModal from '@/user/components/UserFormTemplateModal.vue';
import UserFormTemplateList from '@/user/components/UserFormTemplateList.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { URL_USER, USER_GOALS_OPTIONS } from '@/user/constants';
import { userService } from '@/user/services';
import { equipmentService } from '@/equipment/services';
import { exerciseService } from '@/exercise/services';
import { URL_HOME } from '@/common/constants';
import { TOKEN_NAME } from '@/auth/constants';
import { isAdmin } from '@/auth/composables';
import { useUserFormTabs } from '@/user/composables';
import { useTI18n } from '@/common/composables';

interface IProps {
  user?: IUser;
  isEdit?: boolean;
}

const props = defineProps<IProps>();

const router = useRouter();
const { t, locale } = useTI18n();
const queryClient = useQueryClient();

const { data: equipments } = equipmentService.getAll();
const { data: exercises } = exerciseService.getAll();
const { data: exercisesCustom } = exerciseService.getCustom({ enabled: !isAdmin.value });

const formData = ref<IUser>({
  email: '',
  name: '',
  password: '',
  equipments: [],
  templates: [],
  defaultWeights: {},
  role: 'user',
});

const { TABS } = useUserFormTabs(props.isEdit, isAdmin);

const currentTab = ref(TABS.value[0].value);
const currentExercise = ref<IExercise>();
const currentTemplate = ref<IUserTemplate>();

const isShowCreateExercise = ref(false);
const isShowTemplateModal = ref(false);
const isPasswordUpdated = ref(false);

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
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_CHART] });
    toast.success(t('user.updated'));
    if (props.user) formData.value = clone(props.user);
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

const { error, isValid } = useValidator(
  formData,
  { email: [required, email], name: [required, letters], password: props.isEdit ? [] : [required, min(6)] },
  locale.value
);

function submit() {
  if (!isValid()) return;

  if (formData.value.templates) formData.value.templates = deleteTempId(formData.value.templates);

  if (props.isEdit) {
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

function createExercise() {
  currentExercise.value = undefined;
  isShowCreateExercise.value = true;
}

function addTemplate() {
  currentTemplate.value = undefined;
  isShowTemplateModal.value = true;
}

function createTemplate(template: IUserTemplate) {
  isShowTemplateModal.value = false;
  if (!template._id) template._id = createTempId();

  formData.value.templates = formData.value.templates ? [...formData.value.templates, template] : [template];
}

function saveTemplate(template: IUserTemplate) {
  isShowTemplateModal.value = false;
  if (!template._id) template._id = createTempId();

  formData.value.templates = formData.value.templates?.map((templateToUpdate) => {
    return templateToUpdate._id === template._id ? template : templateToUpdate;
  });

  currentTemplate.value = undefined;
}

function editTemplate(template: IUserTemplate) {
  currentTemplate.value = template;
  isShowTemplateModal.value = true;
}

function deleteTemplate(id?: string) {
  if (!id) return;

  isShowTemplateModal.value = false;
  formData.value.templates = formData.value.templates?.filter((template) => template._id !== id);
}

onBeforeMount(() => {
  if (props.user) formData.value = clone(props.user);
});
</script>
