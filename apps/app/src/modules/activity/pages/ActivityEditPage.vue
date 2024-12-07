<template>
  <div>
    <UiFlex column gap="32">
      <ActivityInfo
        v-if="activity?.exercises"
        :id="activity._id"
        :start="activity.dateCreated"
        :end="activity.dateUpdated"
        :exercises="activity.exercises"
        isAdmin
      />

      <UiModal
        v-if="activity?._id"
        v-model="isShowConfirm"
        isConfirm
        @confirm="mutateDelete(activity._id)"
        width="380"
        lang="ru"
      >
        Подтверждаете удаление?
      </UiModal>

      <UiFlex justify="space-between">
        <UiButton @click="router.go(-1)">Назад</UiButton>
        <UiButton @click="isShowConfirm = true" layout="secondary">Удалить</UiButton>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import { useQueryClient } from 'mhz-helpers';
import { API_ACTIVITY } from 'fitness-tracker-contracts';

import ActivityInfo from '@/activity/components/ActivityInfo.vue';

import { getActivity, deleteActivity } from '@/activity/services';
import { URL_ACTIVITY_ADMIN } from '@/activity/constants';

const isShowConfirm = ref(false);

const route = useRoute();
const router = useRouter();

const queryClient = useQueryClient();

const activityId = computed(() => route.params.activity.toString());

const { data: activity } = getActivity({}, activityId);

const { mutate: mutateDelete } = deleteActivity({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_ACTIVITY] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
    toast.success('Занятие удалено');
    router.push(URL_ACTIVITY_ADMIN);
  },
});
</script>
