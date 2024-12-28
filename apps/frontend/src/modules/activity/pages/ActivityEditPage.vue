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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast, UiButton, UiFlex, UiModal } from 'mhz-ui';
import { useQueryClient } from 'mhz-helpers';
import { API_ACTIVITY } from 'fitness-tracker-contracts';

import ActivityInfo from '@/activity/components/ActivityInfo.vue';

import { activityService } from '@/activity/services';
import { URL_ACTIVITY_ADMIN } from '@/activity/constants';
import { useRouteId } from '@/common/composables';

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
