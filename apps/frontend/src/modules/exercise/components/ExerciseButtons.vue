<template>
  <div :class="$style.buttons" :data-edit="props.isEdit">
    <button
      v-if="props.isEdit && props.index !== 0"
      @click="emit('setIndex', props.index)"
      type="button"
      :class="[$style.arrow, $style.pointer, $style.button]"
      data-test="exercise-buttons-index-down"
    >
      <IconArrow width="16" height="16" :class="$style.rotateArrow" />
    </button>

    <button
      v-if="props.isEdit && !props.isLast"
      @click="emit('setIndex', props.index + 1)"
      type="button"
      :class="[$style.arrow, $style.pointer, $style.button]"
      data-test="exercise-buttons-index-up"
    >
      <IconArrow width="16" height="16" />
    </button>

    <button
      v-if="props.isEdit && props.isSetCreatable"
      @click="emit('createSet')"
      type="button"
      :class="[$style.button, $style.pointer, $style.success]"
      data-test="exercise-buttons-create-set"
    >
      +{{ t('set.super') }}
    </button>

    <button @click="handleEditRepeats" :class="$style.button" type="button" data-test="exercise-buttons-repeats">
      x{{ props.repeats }}
    </button>

    <button
      @click="handleEditWeight"
      v-if="props.isEdit ? props.isWeights : !!props.weight"
      :class="$style.button"
      type="button"
      data-test="exercise-buttons-weight"
    >
      <IconWeight width="14" height="14" /> {{ props.weight }} {{ t('kg') }}
    </button>

    <span
      v-if="!props.isEdit && !props.isDone && !props.isFutureActivity"
      :class="[$style.button, $style.error]"
      data-test="exercise-buttons-not-done"
    >
      <IconFail width="14" height="14" /> {{ t('notDone') }}
    </span>

    <span
      v-if="!props.isEdit && props.isToFailure"
      :class="[$style.button, $style.success]"
      data-test="exercise-buttons-to-failure"
    >
      <IconToFailure width="14" height="14" /> {{ t('toFailure') }}
    </span>

    <span v-if="!props.isEdit && props.duration" :class="$style.button" data-test="exercise-buttons-duration">
      <IconDuration width="14" height="14" /> {{ formatDuration(props.duration, locale) }}
    </span>

    <button
      v-if="props.isEdit"
      @click="emit('delete')"
      type="button"
      :class="[$style.button, $style.pointer, $style.error]"
      data-test="exercise-buttons-delete"
    >
      {{ t('delete') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { formatDuration } from 'mhz-helpers';

import IconArrow from '@/common/icons/arrow.svg';
import IconWeight from '@/common/icons/weight.svg';
import IconDuration from '@/common/icons/duration.svg';
import IconToFailure from '@/common/icons/to-failure.svg';
import IconFail from '@/common/icons/fail.svg';

import { useTI18n } from '@/common/composables';

interface IProps {
  repeats: number;
  index: number;
  weight?: number;
  isSetCreatable?: boolean;
  isLast?: boolean;
  isEdit?: boolean;
  isDone?: boolean;
  isToFailure?: boolean;
  duration?: number;
  isFutureActivity?: boolean;
  isWeights?: boolean;
}

interface IEmit {
  delete: [];
  createSet: [];
  setIndex: [index: number];
  editRepeats: [];
  editWeight: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useTI18n();

function handleEditRepeats() {
  if (props.isEdit) emit('editRepeats');
}

function handleEditWeight() {
  if (props.isEdit) emit('editWeight');
}
</script>

<style module lang="scss">
.buttons {
  display: flex;
  align-items: center;
  height: 24px;
  pointer-events: none;
  border: 1px solid var(--color-gray-dark);
  border-radius: 6px;

  &[data-edit='true'] {
    height: 32px;
    pointer-events: all;
  }
}

.button {
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  padding: 0 6px;
  font-size: 0.875rem;
  color: var(--color-black);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  background: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  border: none;
  border-left: 1px solid var(--color-gray-dark);

  &:first-child {
    border-left: none;
  }

  &:active {
    background: var(--color-gray-light);
    background-color: var(--color-gray-light);
  }

  :focus {
    outline: none;
  }
}

.arrow {
  font-size: 1rem;
  color: var(--color-primary);
}

.rotateArrow {
  rotate: 180deg;
}

.pointer {
  cursor: pointer;
}

.success {
  color: var(--color-success-dark);
}

.error {
  color: var(--color-error);
}

:global(.dark) {
  .buttons {
    border-color: var(--color-gray-dark-extra);
  }

  .button {
    color: var(--color-white);
    border-left-color: var(--color-gray-dark-extra);
  }

  .success {
    color: var(--color-success);
  }

  .error {
    color: var(--color-error-light);
  }
}
</style>
