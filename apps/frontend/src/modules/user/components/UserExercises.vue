<template>
  <UiFlex column gap="16">
    <UiFlex wrap>
      <UiChip
        v-for="exercise in props.exercises"
        :key="exercise._id"
        isEdit
        @edit="emit('edit', exercise)"
        align="center"
        data-test="user-exercise"
      >
        <span data-test="user-exercise-title">{{ exercise[localeField('title', locale)] }}</span>
      </UiChip>
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex, UiChip } from 'mhz-ui';
import { localeField } from 'mhz-helpers';
import { IExercise } from 'fitness-tracker-contracts';

import { useTI18n } from '@/common/composables';

interface IProps {
  exercises?: IExercise[];
}

interface IEmit {
  edit: [exercise: IExercise];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { locale } = useTI18n();
</script>
