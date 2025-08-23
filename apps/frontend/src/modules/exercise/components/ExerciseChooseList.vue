<template>
  <div :class="$style.list">
    <UiFlex gap="4">
      <button
        v-for="muscle in muscleFilters"
        :key="muscle._id"
        @click="setCurrentMuscle(muscle._id)"
        type="button"
        :class="$style.button"
        :data-current="muscle._id === currentMuscle"
        data-test="muscle"
      >
        {{ muscle[localeField('title', locale)] }}
      </button>
    </UiFlex>

    <div>
      <UiField :label="t('exercise.filterByTitle')">
        <UiInput v-model="title" data-test="exercise-title" />
      </UiField>
    </div>

    <UiFlex column>
      <UiSpoiler
        v-model="exerciseSpoilers[index]"
        :title="exercise[localeField('title', locale)]"
        v-for="(exercise, index) in filterExercisesByTitleAndMuscle(props.exercises, title, currentMuscle, user)"
        :key="exercise._id"
        data-test="exercise-spoiler"
      >
        <ExerciseChooseElement
          v-if="user"
          :exercise="exercise"
          :weights="getAvailableExerciseWeights(exercise, user)"
          :user="user"
          @add="(choosenExercise) => emit('choose', choosenExercise)"
          data-test="exercise-choose-element"
        />
      </UiSpoiler>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { IExercise, IExerciseChoosen } from 'fitness-tracker-contracts';
import { UiField, UiFlex, UiInput, UiSpoiler } from 'mhz-ui';
import { localeField } from 'mhz-helpers';

import ExerciseChooseElement from '@/exercise/components/ExerciseChooseElement.vue';

import { useAuthCheck } from '@/auth/composables';
import { muscleService } from '@/muscle/services';
import { filterExercisesByTitleAndMuscle, getAvailableExerciseWeights } from '@/exercise/helpers';

interface IProps {
  exercises: IExercise[];
}

interface IEmit {
  choose: [choosenExercise: IExerciseChoosen];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useI18n();
const { user } = useAuthCheck();

const exerciseSpoilers = ref([]);

const currentMuscle = ref<string>('');
const title = ref('');

const { data: muscles } = muscleService.getAll();

const muscleFilters = computed(() => [{ _id: '', title: t('all'), title_en: t('all') }, ...(muscles.value || [])]);

function setCurrentMuscle(id?: string) {
  currentMuscle.value = id || '';
  exerciseSpoilers.value = [];
}
</script>

<style module lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 320px;
  height: 64dvh;
  overflow: auto;
}

.button {
  padding: 4px 1px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gray-dark-extra);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;

  &[data-current='true'] {
    color: var(--color-primary);
  }
}
</style>
