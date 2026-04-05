<template>
  <UiFlex column gap="16">
    <UiFlex column>
      <h3 data-test="exercise-info-title">
        {{ props.exercise.exercise[localeField('title', locale)] }}
      </h3>

      <span
        v-if="isAuth && props.exercise.isUserEquipmentMatches"
        :class="$style.available"
        data-test="exercise-info-available"
      >
        {{ t('available') }}
      </span>

      <div>
        <div>{{ t('muscle.many') }}</div>

        <UiFlex>
          <UiChip
            v-for="muscle in props.exercise.exercise.muscles"
            :key="muscle._id"
            data-test="exercise-info-muscle"
            :style="`border-bottom: 3px solid ${muscle.color}`"
          >
            {{ muscle[localeField('title', locale)] }}
          </UiChip>
        </UiFlex>
      </div>

      <div v-if="props.exercise.exercise.equipment" data-test="exercise-info-equipment">
        <div>{{ t('equipment.required') }}</div>

        <UiFlex>
          <UiChip data-test="exercise-info-equipment-title">
            {{ props.exercise.exercise.equipment?.[localeField('title', locale)] }}
          </UiChip>
        </UiFlex>
      </div>

      <div v-if="props.exercise.exercise.isWeights" data-test="exercise-info-is-weights">
        <div>
          <span>{{ t('equipment.suitable') }}</span>

          <span v-if="props.exercise.exercise.isWeightsRequired" data-test="exercise-info-is-weights-required">
            <b> ({{ t('required').toLowerCase() }})</b>
          </span>
        </div>

        <UiFlex>
          <UiChip
            v-for="equipmentForWeight in props.exercise.exercise.equipmentForWeight"
            :key="equipmentForWeight._id"
            data-test="exercise-info-equipment-for-weight"
          >
            {{ equipmentForWeight[localeField('title', locale)] }}
          </UiChip>
        </UiFlex>
      </div>
    </UiFlex>

    <img
      v-if="props.exercise.exercise.image"
      :src="imagePath"
      :alt="props.exercise.exercise[localeField('title', locale)]"
      crossorigin="anonymous"
    />

    <div v-if="props.exercise.exercise.description" data-test="exercise-info-description">
      {{ props.exercise.exercise[localeField('description', locale)] }}
    </div>
  </UiFlex>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IExerciseStatistics } from 'fitness-tracker-contracts';
import { UiFlex, UiChip } from 'mhz-ui';
import { isAuth, localeField } from 'mhz-helpers';

import { useTI18n } from '@/common/composables';

interface IProps {
  exercise: IExerciseStatistics;
}

const props = defineProps<IProps>();

const { t, locale } = useTI18n();

const imagePath = computed(() => `${import.meta.env.VITE_PATH_UPLOAD}${props.exercise.exercise.image}`);
</script>

<style module lang="scss">
.available {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-success-dark);
}
</style>
