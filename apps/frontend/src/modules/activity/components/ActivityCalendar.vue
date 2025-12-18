<template>
  <div>
    <UiCalendar
      :events="props.events"
      @eventClick="(event) => showEvent(event as IActivityCalendarEvent<IExerciseDone>)"
      @update="(dates) => emit('update', dates)"
      :lang="locale"
      data-test="activity-calendar"
    />

    <UiModal v-model="isShowModal" isScrollable data-test="activity-calendar-modal">
      <ActivityInfo
        :start="start"
        :end="end"
        :exercises="exercises"
        :id="id"
        isPopup
        @delete="deleteEvent"
        @createTemplate="createUserTemplate"
        data-test="activity-calendar-info"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { API_AUTH_GET, API_USER, IExerciseDone, IUserTemplate } from 'fitness-tracker-contracts';
import { toast, UiCalendar, UiModal } from 'mhz-ui';
import { ICalendarDates, useQueryClient } from 'mhz-helpers';

import { IActivityCalendarEvent } from '@/activity/interface';
import { useTI18n } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';
import { userService } from '@/user/services';

interface IProps {
  events?: IActivityCalendarEvent<IExerciseDone>[];
}

interface IEmit {
  update: [dates: ICalendarDates];
  deleteEvent: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const ActivityInfo = defineAsyncComponent(() => import('@/activity/components/ActivityInfo.vue'));

const { t, locale } = useTI18n();
const queryClient = useQueryClient();
const { user } = useAuthCheck();

const isShowModal = ref(false);

const start = ref<Date | null>(null);
const end = ref<Date | null>(null);
const exercises = ref<IExerciseDone[]>([]);
const id = ref('');

const { mutate: mutateUpdate } = userService.update({
  onSuccess: async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: [API_USER] }),
      queryClient.refetchQueries({ queryKey: [API_AUTH_GET] }),
    ]);

    toast.success(t('template.added'));
  },
});

function showEvent(event: IActivityCalendarEvent<IExerciseDone>) {
  start.value = event.start;
  end.value = event.end;
  exercises.value = event.content;
  id.value = event._id || '';

  isShowModal.value = true;
}

function deleteEvent() {
  emit('deleteEvent');
  isShowModal.value = false;
}

function createUserTemplate(template: IUserTemplate) {
  isShowModal.value = false;

  const templates = user.value?.templates ? [...user.value.templates, template] : [template];

  if (user.value) mutateUpdate({ ...user.value, templates });
}
</script>
