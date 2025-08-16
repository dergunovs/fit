<template>
  <UiFlex column gap="16">
    <UiFlex wrap>
      <UiChip v-for="exercise in props.exercises" :key="exercise._id" align="center" data-test="user-exercises">
        <span data-test="user-exercise-title">{{ exercise[localeField('title', locale)] }}</span>

        <button
          v-if="exercise._id"
          @click="emit('edit', exercise)"
          type="button"
          :class="$style.edit"
          data-test="user-exercise-edit"
        >
          <IconEdit width="20" height="20" />
        </button>
      </UiChip>
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { UiFlex, UiChip } from 'mhz-ui';
import { localeField } from 'mhz-helpers';
import { IExercise } from 'fitness-tracker-contracts';

import IconEdit from '@/common/icons/edit.svg';

interface IProps {
  exercises?: IExercise[];
}

interface IEmit {
  edit: [exercise: IExercise];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { locale } = useI18n();
</script>

<style module lang="scss">
.edit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
