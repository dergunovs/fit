<template>
  <div>
    <UiFlex column gap="32">
      <ActivityInfo
        v-if="activity?.exercises && activity._id && activity.dateCreated && activity.dateUpdated"
        :id="activity._id"
        :start="activity.dateCreated"
        :end="activity.dateUpdated"
        :exercises="activity.exercises"
        data-test="activity-info"
      />

      <UiModal
        v-if="activity?._id"
        v-model="isShowConfirm"
        isConfirm
        @confirm="mutateDelete(activity._id)"
        width="360"
        data-test="activity-modal"
      >
        Подтверждаете удаление?
      </UiModal>

      <UiFlex justify="space-between">
        <UiButton @click="router.go(-1)" data-test="activity-go-back-button">Назад</UiButton>
        <UiButton @click="isShowConfirm = true" layout="secondary" data-test="activity-delete-button">Удалить</UiButton>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import { useQueryClient, useRouteId } from 'mhz-helpers';
import { API_ACTIVITY } from 'fitness-tracker-contracts';

import ActivityInfo from '@/activity/components/ActivityInfo.vue';

import { activityService } from '@/activity/services';
import { URL_ACTIVITY_ADMIN } from '@/activity/constants';

const isShowConfirm = ref(false);

const router = useRouter();

const queryClient = useQueryClient();

const { id } = useRouteId('activity');

const { data: activity } = activityService.getOne({}, id);

const { mutate: mutateDelete } = activityService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_ACTIVITY] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
    toast.success('Занятие удалено');
    router.push(URL_ACTIVITY_ADMIN);
  },
});
</script>
