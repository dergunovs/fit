<template>
  <div :class="$style.buttons">
    <button
      v-if="props.index !== 0"
      @click="emit('setIndex', props.index)"
      type="button"
      :class="[$style.arrow, $style.button]"
      data-test="exercise-choose-buttons-index-down"
    >
      <IconArrow width="16" height="16" :class="$style.rotateArrow" />
    </button>

    <button
      v-if="!props.isLast"
      @click="emit('setIndex', props.index + 1)"
      type="button"
      :class="[$style.arrow, $style.button]"
      data-test="exercise-choose-buttons-index-up"
    >
      <IconArrow width="16" height="16" />
    </button>

    <button
      v-if="props.isSetCreatable"
      @click="emit('createSet')"
      type="button"
      :class="[$style.button, $style.set]"
      data-test="exercise-choose-buttons-create-set"
    >
      +{{ t('set.super') }}
    </button>

    <span :class="$style.button" data-test="exercise-choose-buttons-repeats">x{{ props.repeats }}</span>

    <div v-if="props.weight" :class="$style.button" data-test="exercise-choose-buttons-weight">
      <IconWeight width="14" height="14" /> {{ props.weight }} {{ t('kg') }}
    </div>

    <button
      @click="emit('delete')"
      type="button"
      :class="[$style.button, $style.delete]"
      data-test="exercise-choose-buttons-delete"
    >
      {{ t('delete') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import IconArrow from '@/common/icons/arrow.svg';
import IconWeight from '@/common/icons/weight.svg';

import { useTI18n } from '@/common/composables';

interface IProps {
  repeats: number;
  isSetCreatable: boolean;
  index: number;
  isLast: boolean;
  weight?: number;
}

interface IEmit {
  delete: [];
  createSet: [];
  setIndex: [index: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t } = useTI18n();
</script>

<style module lang="scss">
.buttons {
  display: flex;
  align-items: center;
  height: 32px;
  border: 1px solid var(--color-gray-dark);
  border-radius: 8px;
}

.button {
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  padding: 0 7px;
  font-size: 0.875rem;
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

  &:disabled {
    color: var(--color-gray);
    cursor: default;
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
  cursor: pointer;
}

.rotateArrow {
  rotate: 180deg;
}

.set {
  color: var(--color-success-dark);
  cursor: pointer;
}

.delete {
  color: var(--color-error);
  cursor: pointer;
}
</style>
