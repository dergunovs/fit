<template>
  <div :class="$style.exercise" :data-hide="props.isHideTitle">
    <UiFlex column gap="4" align="flex-start" grow>
      <div v-if="!props.isHideTitle" data-test="exercise-choosen-title">
        {{ title }}
      </div>

      <ExerciseButtons
        v-if="props.exercise._id"
        :isEdit="props.isEdit"
        :repeats="props.exercise.repeats"
        :weight="props.exercise.weight"
        :index="props.index"
        :isLast="props.isLast"
        :isSetCreatable="props.isSetCreatable"
        :isDone="props.isDone"
        :isToFailure="props.isToFailure"
        :duration="props.duration"
        :isFutureActivity="props.isFutureActivity"
        @createSet="emit('createSet')"
        @delete="emit('delete', props.exercise._id)"
        @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
        @editRepeats="toggleExerciseRepeats"
        data-test="exercise-buttons"
      />

      <Transition name="slide" mode="out-in">
        <ExerciseRepeats
          v-show="isShowEditRepeats"
          :modelValue="props.exercise.repeats"
          :baseRepeat="props.exercise.repeats"
          @update:modelValue="updateRepeats"
          data-test="exercise-repeats"
        />
      </Transition>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IExerciseChoosen } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';
import { localeField } from 'mhz-helpers';

import ExerciseButtons from '@/exercise/components/ExerciseButtons.vue';
import ExerciseRepeats from '@/exercise/components/ExerciseRepeats.vue';

import { useTI18n } from '@/common/composables';

interface IProps {
  exercise: IExerciseChoosen;
  index: number;
  isEdit?: boolean;
  isSetCreatable?: boolean;
  isLast?: boolean;
  isHideTitle?: boolean;
  isDone?: boolean;
  isToFailure?: boolean;
  duration?: number;
  isFutureActivity?: boolean;
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
  setRepeats: [repeats: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useTI18n();

const isShowEditRepeats = ref(false);

const title = computed(() => {
  const isExerciseExists = !!props.exercise.exercise;

  if (!isExerciseExists) return t('exercise.deleted');

  const exerciseTitle = props.exercise.exercise?.[localeField('title', locale.value)];

  if (!props.isEdit) return exerciseTitle;

  return `${props.index + 1}. ${exerciseTitle}`;
});

function toggleExerciseRepeats() {
  isShowEditRepeats.value = !isShowEditRepeats.value;
}

function updateRepeats(repeats: number) {
  emit('setRepeats', repeats);

  toggleExerciseRepeats();
}
</script>

<style module lang="scss">
.exercise {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--color-gray-light-extra);
  border-bottom: 1px solid var(--color-gray);
  border-radius: 8px;

  &[data-hide='true'] {
    margin-top: -14px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}

:global(.dark) {
  .exercise {
    background-color: var(--color-black);
    border: 1px solid var(--color-gray-dark-extra);

    &[data-hide='true'] {
      border-top: none;
    }
  }
}
</style>

<style lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: all 200ms ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
