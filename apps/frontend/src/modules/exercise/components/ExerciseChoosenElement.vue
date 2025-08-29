<template>
  <div :class="$style.exercise">
    <span data-test="exercise-title">{{ exerciseTitle }}</span>

    <UiFlex>
      <UiButton v-if="props.isSetCreatable" @click="emit('createSet')" layout="plain" data-test="exercise-create-set">
        +{{ t('set.super') }}
      </UiButton>

      <UiClose
        v-if="props.exercise._id"
        @click="emit('delete', props.exercise._id)"
        isSmall
        data-test="exercise-delete"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { IExerciseChoosen, TLocale } from 'fitness-tracker-contracts';
import { UiButton, UiClose, UiFlex } from 'mhz-ui';
import { localeField } from 'mhz-helpers';

interface IProps {
  exercise: IExerciseChoosen;
  index: number;
  isSetCreatable: boolean;
}

interface IEmit {
  delete: [id: string];
  createSet: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useI18n<DefaultLocaleMessageSchema, TLocale>();

const exerciseTitle = computed(
  () => `${props.index}. ${props.exercise.exercise?.[localeField('title', locale.value)]} x${props.exercise.repeats}`
);
</script>

<style module lang="scss">
.exercise {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: var(--color-gray-light);
  border-radius: 16px;
}
</style>
