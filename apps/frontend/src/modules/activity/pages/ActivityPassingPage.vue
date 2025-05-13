<template>
  <div>
    <ActivityPassingForm
      v-if="activity"
      :activity="formData"
      @setDateCreated="(dateCreated) => (formData.dateCreated = dateCreated)"
      @setDateUpdated="(dateUpdated) => (formData.dateUpdated = dateUpdated)"
      @updateExercises="(exercises) => (formData.exercises = exercises)"
      @done="(isDone) => (formData.isDone = isDone)"
      @exit="exitActivity"
      data-test="activity-passing-form"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRouteId, useQueryClient, clone } from 'mhz-helpers';
import { toast } from 'mhz-ui';
import { API_ACTIVITY, API_ACTIVITY_CHART, API_ACTIVITY_STATISTICS, IActivity } from 'fitness-tracker-contracts';

import ActivityPassingForm from '@/activity/components/ActivityPassingForm.vue';

import { activityService } from '@/activity/services';
import { usePageLock } from '@/common/composables';
import { URL_HOME } from '@/common/constants';

const router = useRouter();
const { id } = useRouteId('activity');

const { t } = useI18n();

const queryClient = useQueryClient();

usePageLock();

const { data: activity } = activityService.getOne({}, id);

const formData = ref<IActivity>({
  exercises: [],
  dateCreated: undefined,
  dateUpdated: undefined,
  isDone: false,
});

watch(
  () => activity.value,
  () => {
    if (activity.value) formData.value = clone(activity.value);
  }
);

const { mutate: mutateUpdate } = activityService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY] });
  },
});

function exitActivity() {
  mutateUpdate(formData.value);

  toast.success(t('activity.finished'));

  setTimeout(async () => {
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_STATISTICS] });
    await queryClient.refetchQueries({ queryKey: [API_ACTIVITY_CHART] });

    router.push(URL_HOME);
  }, 1000);
}
</script>
