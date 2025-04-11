<template>
  <div>
    <UserForm v-if="user" :user="user" isEdit data-test="user-form">
      <UserExercises
        v-if="exercises?.length && !isAdmin"
        :exercises="exercises"
        @edit="editExercise"
        data-test="user-exercises"
      />

      <UiFlex v-if="!isAdmin" column gap="16">
        <UiButton @click="isShowCreateExercise = true" data-test="user-add-exercise">
          {{ t('exercise.addCustom') }}
        </UiButton>

        <UiModal v-model="isShowCreateExercise" width="360" data-test="user-exercise-form-modal">
          <div :class="$style.form">
            <h3>{{ t('exercise.addCustom') }}</h3>

            <ExerciseForm
              :exercise="currentExercise"
              isDisableRedirect
              @hide="hideExerciseModal"
              data-test="user-exercise-form"
            />
          </div>
        </UiModal>
      </UiFlex>
    </UserForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IExercise } from 'fitness-tracker-contracts';
import { UiButton, UiModal, UiFlex } from 'mhz-ui';

import UserForm from '@/user/components/UserForm.vue';
import UserExercises from '@/user/components/UserExercises.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

import { isAdmin, useAuthCheck } from '@/auth/composables';
import { exerciseService } from '@/exercise/services';

const { t } = useI18n();
const { user } = useAuthCheck();

const { data: exercises } = exerciseService.getCustom();

const isShowCreateExercise = ref(false);

const currentExercise = ref<IExercise>();

function editExercise(exercise: IExercise) {
  currentExercise.value = exercise;
  isShowCreateExercise.value = true;
}

function hideExerciseModal() {
  currentExercise.value = undefined;
  isShowCreateExercise.value = false;
}
</script>

<style module lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 64dvh;
  overflow-y: auto;
}
</style>
