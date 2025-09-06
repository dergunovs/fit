<template>
  <UiFlex gap="16" column>
    <UiFlex>
      <UiFlex column>
        <div>{{ t('equipment.one') }}</div>

        <UiFlex>
          <UiSelect
            v-model="choosenEquipment"
            :options="excludeChoosenUserEquipment(props.equipments, props.modelValue)"
            :isDisabled="isEditEquipment || choosenEquipmentWeights.length > 0"
            :lang="locale"
            :isLocaleField="locale === 'en'"
            data-test="user-equipment-options"
          />
        </UiFlex>
      </UiFlex>

      <UiFlex v-if="choosenEquipment?.isWeights" column>
        <div>{{ t('weight') }}</div>

        <UiInput v-model="choosenEquipmentWeight" type="number" step="1" min="1" max="500" data-test="user-weight" />
      </UiFlex>
    </UiFlex>

    <UiFlex v-if="choosenEquipment?.isWeights">
      <UiButton :isDisabled="isAddWeightDisabled" layout="secondary" @click="addWeight" data-test="user-add-weight">
        {{ t('choose') }}
      </UiButton>
    </UiFlex>

    <UiFlex v-if="choosenEquipmentWeights.length > 0" column>
      <div>{{ t('addedWeights') }}</div>

      <UiFlex wrap>
        <UiChip v-for="weight in choosenEquipmentWeights" :key="weight" data-test="user-added-weights">
          <IconWeight width="16" height="16" /><span data-test="user-added-weight">{{ weight }}</span> {{ t('kg') }}
          <UiClose @click="deleteWeight(weight)" isSmall isDelete data-test="user-delete-weight" />
        </UiChip>
      </UiFlex>
    </UiFlex>

    <UiFlex>
      <UiButton v-if="isEditEquipment" @click="saveEquipment" data-test="user-save-equipment">
        {{ t('equipment.save') }}
      </UiButton>

      <UiButton
        v-if="isEditEquipment"
        @click="resetEquipment"
        layout="secondary"
        isNarrow
        data-test="user-reset-equipment"
      >
        {{ t('cancel') }}
      </UiButton>

      <UiButton v-else :isDisabled="isAddEquipmentDisabled" @click="addEquipment" data-test="user-add-equipment">
        {{ t('equipment.add') }}
      </UiButton>
    </UiFlex>

    <UiFlex v-if="props.modelValue?.length" column>
      <div>{{ t('equipment.added') }}</div>

      <UiFlex wrap>
        <UiChip
          v-for="equipment in props.modelValue"
          :key="`${equipment.equipment?._id}-${equipment.weights?.join()}`"
          data-test="user-equipment"
        >
          <span data-test="user-equipment-title">{{ equipment.equipment?.[localeField('title', locale)] }}</span>

          <span v-for="weight in equipment.weights" :key="weight" data-test="user-equipment-weights">
            <span data-test="user-equipment-weight">{{ weight }}</span> {{ t('kg') }}
          </span>

          <button
            v-if="equipment.equipment?.isWeights"
            type="button"
            @click="editEquipment(equipment)"
            :class="$style.edit"
            data-test="user-equipment-edit"
          >
            <IconEdit width="20" height="20" />
          </button>

          <UiClose
            v-if="equipment.equipment?._id"
            @click="deleteEquipment(equipment.equipment._id)"
            isSmall
            isDelete
            data-test="user-delete-equipment"
          />
        </UiChip>
      </UiFlex>
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IEquipment, IUserEquipment } from 'fitness-tracker-contracts';
import { UiButton, UiFlex, UiInput, UiSelect, UiChip, UiClose } from 'mhz-ui';
import { localeField } from 'mhz-helpers';

import IconWeight from '@/common/icons/weight.svg';
import IconEdit from '@/common/icons/edit.svg';

import { excludeChoosenUserEquipment } from '@/user/helpers';
import { useTI18n } from '@/common/composables';

interface IProps {
  equipments: IEquipment[];
  modelValue?: IUserEquipment[];
}

interface IEmit {
  'update:modelValue': [value?: IUserEquipment[]];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t, locale } = useTI18n();

const choosenEquipment = ref<IEquipment>();
const choosenEquipmentWeight = ref<number>(0);
const choosenEquipmentWeights = ref<number[]>([]);

const isEditEquipment = ref(false);

const isAddWeightDisabled = computed(
  () =>
    !choosenEquipmentWeight.value ||
    Number.isNaN(Number(choosenEquipmentWeight.value)) ||
    choosenEquipmentWeight.value < 1 ||
    choosenEquipmentWeight.value > 500 ||
    choosenEquipmentWeights.value.includes(Number(choosenEquipmentWeight.value))
);

const isAddEquipmentDisabled = computed(
  () =>
    !choosenEquipment.value ||
    (choosenEquipment.value.isWeights && choosenEquipmentWeights.value.length === 0) ||
    props.modelValue?.some((equipment) => equipment.equipment?._id === choosenEquipment.value?._id)
);

function addWeight() {
  if (isAddWeightDisabled.value) return;

  choosenEquipmentWeights.value = [...choosenEquipmentWeights.value, Number(choosenEquipmentWeight.value)].sort(
    (a, b) => a - b
  );
}

function deleteWeight(weightToDelete: number) {
  choosenEquipmentWeights.value = choosenEquipmentWeights.value.filter((weight) => weight !== weightToDelete);
}

function addEquipment() {
  if (isAddEquipmentDisabled.value) return;

  const updatedEquipments = props.modelValue?.length
    ? [...props.modelValue, { equipment: choosenEquipment.value, weights: choosenEquipmentWeights.value }]
    : [{ equipment: choosenEquipment.value, weights: choosenEquipmentWeights.value }];

  emit('update:modelValue', updatedEquipments);

  resetEquipment();
}

function editEquipment(equipment: IUserEquipment) {
  isEditEquipment.value = true;

  choosenEquipment.value = equipment.equipment;
  choosenEquipmentWeight.value = 0;
  choosenEquipmentWeights.value = equipment.weights?.length ? [...equipment.weights] : [];
}

function saveEquipment() {
  const updatedEquipments = props.modelValue?.map((equipment) => {
    return equipment.equipment?._id === choosenEquipment.value?._id
      ? { equipment: choosenEquipment.value, weights: choosenEquipmentWeights.value }
      : equipment;
  });

  emit('update:modelValue', updatedEquipments);

  resetEquipment();
}

function deleteEquipment(_id: string) {
  const updatedEquipments = props.modelValue?.filter((equipment) => equipment.equipment?._id !== _id);

  emit('update:modelValue', updatedEquipments);
}

function resetEquipment() {
  choosenEquipment.value = undefined;
  choosenEquipmentWeight.value = 0;
  choosenEquipmentWeights.value = [];

  isEditEquipment.value = false;
}
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
