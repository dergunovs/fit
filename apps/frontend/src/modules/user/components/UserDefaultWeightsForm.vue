<template>
  <div>
    <UiFlex v-if="exercisesToChooseWeight.length > 0" column data-test="user-default-weights">
      <UiFlex v-for="exercise in exercisesToChooseWeight" :key="exercise._id" column data-test="user-default-weight">
        <div data-test="user-default-weight-title">{{ exercise[localeField('title', locale)] }}</div>

        <UiSelect
          v-if="exercise._id"
          :modelValue="props.modelValue?.[exercise._id]"
          :options="exercise.options"
          @update:modelValue="(value) => updateWeights(Number(value), exercise._id)"
          :lang="locale"
          data-test="user-default-weight-select"
        />
      </UiFlex>
    </UiFlex>

    <div v-else data-test="user-default-weights-empty">{{ t('exercise.noAvailable') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { IExercise, IUserDefaultWeights, IUserEquipment } from 'fitness-tracker-contracts';
import { UiFlex, UiSelect } from 'mhz-ui';
import { localeField } from 'mhz-helpers';

import { getExercisesToChooseDefaultWeight } from '@/exercise/helpers';

interface IProps {
  userEquipments: IUserEquipment[];
  exercises: IExercise[];
  modelValue?: IUserDefaultWeights;
}

interface IEmit {
  'update:modelValue': [value?: IUserDefaultWeights];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useI18n();

const exercisesToChooseWeight = computed(() =>
  getExercisesToChooseDefaultWeight(props.exercises, props.userEquipments)
);

function updateWeights(weight: number, id?: string) {
  if (!id) return;

  const weightsToUpdate = props.modelValue ? { ...props.modelValue, [id]: weight } : { [id]: weight };

  emit('update:modelValue', weightsToUpdate);
}
</script>
