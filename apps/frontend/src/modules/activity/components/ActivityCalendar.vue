<template>
  <div>
    <UiCalendar
      :events="props.events"
      @eventClick="(event) => showEvent(event as IActivityCalendarEvent<IExerciseDone>)"
      @ready="(dates) => emit('ready', dates)"
      @update="(dates) => emit('update', dates)"
      :lang="locale"
      data-test="activity-calendar"
    />

    <UiModal v-model="isShowModal" width="360" data-test="activity-calendar-modal">
      <ActivityInfo
        :start="start"
        :end="end"
        :exercises="exercises"
        :id="id"
        isPopup
        @delete="deleteEvent"
        data-test="activity-calendar-info"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IExerciseDone } from 'fitness-tracker-contracts';
import { UiCalendar, UiModal } from 'mhz-ui';
import { useI18n } from 'vue-i18n';

import ActivityInfo from '@/activity/components/ActivityInfo.vue';

import { IActivityCalendarEvent, ICalendarDates } from '@/activity/interface';

interface IProps {
  events?: IActivityCalendarEvent<IExerciseDone>[];
}

const props = defineProps<IProps>();
const emit = defineEmits<{ ready: [dates: ICalendarDates]; update: [dates: ICalendarDates]; deleteEvent: [] }>();

const { locale } = useI18n();

const isShowModal = ref(false);

const start = ref<Date | null>(null);
const end = ref<Date | null>(null);
const exercises = ref<IExerciseDone[]>([]);
const id = ref('');

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
</script>
