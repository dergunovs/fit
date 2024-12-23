<template>
  <div>
    <UiCalendar
      :events="props.events"
      :onEventClick="showEvent"
      @ready="(dates) => emit('ready', dates)"
      @update="(dates) => emit('update', dates)"
    />

    <UiModal v-model="isShowModal" width="380">
      <ActivityInfo :start="start" :end="end" :exercises="exercises" :id="id" />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IExerciseDone } from 'fitness-tracker-contracts';
import { UiCalendar, UiModal } from 'mhz-ui';

import ActivityInfo from './ActivityInfo.vue';

import { IActivityCalendarEvent } from '@/activity/interface';

interface IProps {
  events?: IActivityCalendarEvent<IExerciseDone>[];
}

const props = defineProps<IProps>();
const emit = defineEmits(['ready', 'update']);

const isShowModal = ref(false);

const start = ref<Date>();
const end = ref<Date>();
const exercises = ref<IExerciseDone[]>([]);
const id = ref();

function showEvent(event: IActivityCalendarEvent<IExerciseDone>) {
  start.value = event.start;
  end.value = event.end;
  exercises.value = event.content;
  id.value = event._id;

  isShowModal.value = true;
}
</script>
