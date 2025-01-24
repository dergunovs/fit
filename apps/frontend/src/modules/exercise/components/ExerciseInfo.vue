<template>
  <UiFlex column>
    <div :class="$style.title" data-test="exercise-info-title">{{ props.exercise.exercise.title }}</div>

    <div
      v-if="isAuth"
      :class="$style.isMatches"
      :data-matches="props.exercise.isUserEquipmentMatches"
      data-test="exercise-info-matches"
    >
      Вы <span v-if="!props.exercise.isUserEquipmentMatches" data-test="exercise-info-not-matches">не</span> можете
      выполнять это упражнение.
    </div>

    <div>
      <div>Задействованные группы мышц</div>

      <UiFlex>
        <UiChip
          v-for="group in props.exercise.exercise.muscleGroups"
          :key="group._id"
          data-test="exercise-info-muscle-group"
        >
          {{ group.title }}
        </UiChip>
      </UiFlex>
    </div>

    <div v-if="props.exercise.exercise.equipment" data-test="exercise-info-equipment">
      <div>Необходимое оборудование</div>

      <UiFlex>
        <UiChip data-test="exercise-info-equipment-title">{{ props.exercise.exercise.equipment?.title }}</UiChip>
      </UiFlex>
    </div>

    <div v-if="props.exercise.exercise.isWeights" data-test="exercise-info-is-weights">
      <div>Возможное оборудование для веса</div>

      <UiFlex>
        <UiChip
          v-for="equipmentForWeight in props.exercise.exercise.equipmentForWeight"
          :key="equipmentForWeight._id"
          data-test="exercise-info-equipment-for-weight"
        >
          {{ equipmentForWeight.title }}
        </UiChip>
      </UiFlex>
    </div>

    <div v-if="props.exercise.exercise.isWeightsRequired" data-test="exercise-info-is-weights-required">
      <b>Оборудование для веса обязательно.</b>
    </div>

    <div
      v-if="props.exercise.exercise.description"
      v-html="props.exercise.exercise.description"
      data-test="exercise-info-description"
    ></div>
  </UiFlex>
</template>

<script setup lang="ts">
import { IExerciseStatistics } from 'fitness-tracker-contracts';
import { UiFlex, UiChip } from 'mhz-ui';
import { isAuth } from 'mhz-helpers';

interface IProps {
  exercise: IExerciseStatistics;
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.title {
  font-size: 1.25rem;
  font-weight: 700;
}

.isMatches {
  color: var(--color-error);

  &[data-matches='true'] {
    color: var(--color-success-dark);
  }
}
</style>
