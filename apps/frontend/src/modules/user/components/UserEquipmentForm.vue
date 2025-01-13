<template>
  <UiFlex gap="16" column>
    <UiFlex>
      <UiFlex column>
        <div>Оборудование</div>

        <UiFlex>
          <UiSelect
            v-model="choosenEquipment"
            :options="excludeChoosenUserEquipment(props.equipments, props.modelValue)"
            :isDisabled="isEditEquipment"
            lang="ru"
            data-test="user-equipment-options"
          />
        </UiFlex>
      </UiFlex>

      <UiFlex v-if="choosenEquipment?.isWeights" column>
        <div>Возможный вес</div>

        <UiFlex>
          <UiInput v-model="choosenEquipmentWeight" type="number" step="1" min="1" max="500" data-test="user-weight" />

          <UiButton
            :isDisabled="isAddWeightDisabled"
            layout="secondary"
            isNarrow
            @click="addWeight"
            data-test="user-add-weight"
          >
            Добавить
          </UiButton>
        </UiFlex>
      </UiFlex>
    </UiFlex>

    <UiFlex v-if="choosenEquipmentWeights.length" column>
      <div>Добавленные веса</div>

      <UiFlex>
        <UiChip v-for="weight in choosenEquipmentWeights" :key="weight" data-test="user-added-weights">
          <IconWeight width="16" height="16" /><span data-test="user-added-weight">{{ weight }}</span> кг.

          <button type="button" @click="deleteWeight(weight)" :class="$style.delete" data-test="user-delete-weight">
            ×
          </button>
        </UiChip>
      </UiFlex>
    </UiFlex>

    <UiFlex>
      <UiButton v-if="isEditEquipment" @click="saveEquipment" data-test="user-save-equipment">
        Сохранить оборудование
      </UiButton>

      <UiButton v-if="isEditEquipment" @click="resetEquipment" layout="secondary" data-test="user-reset-equipment">
        Отменить редактирование
      </UiButton>

      <UiButton v-else :isDisabled="isAddEquipmentDisabled" @click="addEquipment" data-test="user-add-equipment">
        Добавить оборудование
      </UiButton>
    </UiFlex>

    <UiFlex v-if="props.modelValue?.length" column>
      <div>Добавленное оборудование</div>

      <UiFlex wrap>
        <UiChip
          v-for="equipment in props.modelValue"
          :key="`${equipment.equipment?._id}-${equipment.weights?.join()}`"
          data-test="user-equipment"
        >
          <span data-test="user-equipment-title">{{ equipment.equipment?.title }}</span>

          <span v-for="weight in equipment.weights" :key="weight" data-test="user-equipment-weights">
            <span data-test="user-equipment-weight">{{ weight }}</span> кг.
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

          <button
            v-if="equipment.equipment?.title"
            type="button"
            @click="deleteEquipment(equipment.equipment.title)"
            :class="$style.delete"
            data-test="user-delete-equipment"
          >
            ×
          </button>
        </UiChip>
      </UiFlex>
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IEquipment, IUserEquipment } from 'fitness-tracker-contracts';
import { UiButton, UiFlex, UiInput, UiSelect, UiChip } from 'mhz-ui';

import IconWeight from '@/common/icons/weight.svg';
import IconEdit from '@/common/icons/edit.svg';

import { excludeChoosenUserEquipment } from '@/user/helpers';

interface IProps {
  equipments: IEquipment[];
  modelValue?: IUserEquipment[];
}

const props = defineProps<IProps>();
const emit = defineEmits<{ 'update:modelValue': [value?: IUserEquipment[]] }>();

const choosenEquipment = ref<IEquipment>();
const choosenEquipmentWeight = ref<number>(0);
const choosenEquipmentWeights = ref<number[]>([]);

const isEditEquipment = ref(false);

const isAddWeightDisabled = computed(
  () =>
    choosenEquipmentWeight.value === 0 || choosenEquipmentWeights.value.includes(Number(choosenEquipmentWeight.value))
);

const isAddEquipmentDisabled = computed(
  () =>
    !choosenEquipment.value ||
    (choosenEquipment.value.isWeights && !choosenEquipmentWeights.value.length) ||
    props.modelValue?.some((equipment) => equipment.equipment?.title === choosenEquipment.value?.title)
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
    if (equipment.equipment?.title === choosenEquipment.value?.title) {
      return { equipment: choosenEquipment.value, weights: choosenEquipmentWeights.value };
    } else return equipment;
  });

  emit('update:modelValue', updatedEquipments);

  resetEquipment();
}

function deleteEquipment(title: string) {
  const updatedEquipments = props.modelValue?.filter((equipment) => equipment.equipment?.title !== title);

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

.delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-white);
  cursor: pointer;
  background-color: var(--color-error);
  border: none;
  border-radius: 50%;
}
</style>
