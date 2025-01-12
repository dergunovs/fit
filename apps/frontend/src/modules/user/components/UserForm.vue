<template>
  <div>
    <UiFlex @submit.prevent="submit" tag="form" column gap="24" align="flex-start" data-test="user-form">
      <div v-if="isAdmin" :class="$style.admin" data-test="user-form-admin">Пользователь с правами администратора</div>

      <UiField label="Электронная почта" isRequired :error="error('email')">
        <UiInput v-model="formData.email" data-test="user-form-email" />
      </UiField>

      <UiField label="Имя" isRequired :error="error('name')">
        <UiInput v-model="formData.name" data-test="user-form-name" />
      </UiField>

      <UiField v-if="!props.user?._id" label="Пароль" isRequired :error="error('password')">
        <UiInput v-model="formData.password" data-test="user-form-password" />
      </UiField>

      <UiFlex>
        <UiFlex column>
          <div>Оборудование</div>

          <UiFlex>
            <UiSelect
              v-model="choosenEquipment"
              :options="equipmentsFiltered"
              :isDisabled="isEditEquipment"
              lang="ru"
              data-test="user-form-equipment-options"
            />
          </UiFlex>
        </UiFlex>

        <UiFlex v-if="choosenEquipment?.isWeights" column>
          <div>Возможный вес</div>

          <UiFlex>
            <UiInput
              v-model="choosenEquipmentWeightInput"
              type="number"
              step="1"
              min="1"
              max="500"
              data-test="user-form-weights"
            />

            <UiButton
              :isDisabled="isAddWeightDisabled"
              layout="secondary"
              isNarrow
              @click="addWeight"
              data-test="user-form-add-weight"
            >
              Добавить
            </UiButton>
          </UiFlex>
        </UiFlex>
      </UiFlex>

      <UiFlex v-if="choosenEquipmentWeights.length" column>
        <div>Добавленные веса</div>

        <UiFlex>
          <UiChip v-for="weight in choosenEquipmentWeights" :key="weight">
            <IconWeight width="16" height="16" /><span>{{ weight }}</span> кг.

            <button
              type="button"
              @click="deleteWeight(weight)"
              :class="$style.delete"
              data-test="user-form-delete-weight"
            >
              ×
            </button>
          </UiChip>
        </UiFlex>
      </UiFlex>

      <UiFlex>
        <UiButton v-if="isEditEquipment" @click="saveEquipment" data-test="user-form-save-equipment">
          Сохранить оборудование
        </UiButton>

        <UiButton v-else :isDisabled="isAddEquipmentDisabled" @click="addEquipment" data-test="user-form-add-equipment">
          Добавить оборудование
        </UiButton>
      </UiFlex>

      <UiFlex v-if="formData.equipments?.length" column>
        <div>Добавленное оборудование</div>

        <UiFlex wrap>
          <UiChip
            v-for="equipment in formData.equipments"
            :key="`${equipment.equipment?._id}-${equipment.weights?.join()}`"
            data-test="user-form-equipment"
          >
            <span data-test="user-form-equipment-title">{{ equipment.equipment?.title }}</span>

            <span v-for="weight in equipment.weights" :key="weight" data-test="user-form-equipment-weights">
              <span data-test="user-form-equipment-weight">{{ weight }}</span> кг.
            </span>

            <button
              v-if="equipment.equipment?.isWeights"
              type="button"
              @click="editEquipment(equipment)"
              :class="$style.edit"
              data-test="user-form-equipment-edit"
            >
              <IconEdit width="20" height="20" />
            </button>

            <button
              v-if="equipment.equipment?.title"
              type="button"
              @click="deleteEquipment(equipment.equipment.title)"
              :class="$style.delete"
              data-test="user-form-equipment-delete"
            >
              ×
            </button>
          </UiChip>
        </UiFlex>
      </UiFlex>

      <FormButtons
        :id="props.user?._id"
        :isLoading="isLoadingPost || isLoadingUpdate"
        @delete="(id) => mutateDelete(id)"
        data-test="user-form-buttons"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UiButton, UiField, UiFlex, UiInput, UiSelect, UiChip, toast } from 'mhz-ui';
import { useQueryClient, useValidator, required, email, clone } from 'mhz-helpers';
import { API_USER, IEquipment, IUser, IUserEquipment } from 'fitness-tracker-contracts';

import FormButtons from '@/common/components/FormButtons.vue';
import IconWeight from '@/common/icons/weight.svg';
import IconEdit from '@/common/icons/edit.svg';

import { URL_USER } from '@/user/constants';
import { userService } from '@/user/services';
import { equipmentService } from '@/equipment/services';

interface IProps {
  user?: IUser;
}

const props = defineProps<IProps>();

const router = useRouter();

const queryClient = useQueryClient();

const { data: equipments } = equipmentService.getAll();

const formData = ref<IUser>({
  email: '',
  name: '',
  password: '',
  equipments: [],
  role: 'user',
});

const choosenEquipment = ref<IEquipment>();
const choosenEquipmentWeightInput = ref<number>(0);
const choosenEquipmentWeights = ref<number[]>([]);

const isEditEquipment = ref(false);

const equipmentsFiltered = computed(() =>
  equipments.value?.filter(
    (equipment) =>
      !formData.value.equipments?.some((equipmentToFilter) => equipment.title === equipmentToFilter.equipment?.title)
  )
);

const isAddWeightDisabled = computed(
  () =>
    choosenEquipmentWeightInput.value === 0 ||
    choosenEquipmentWeights.value.includes(Number(choosenEquipmentWeightInput.value))
);

const isAddEquipmentDisabled = computed(
  () =>
    !choosenEquipment.value ||
    (choosenEquipment.value.isWeights && !choosenEquipmentWeights.value.length) ||
    formData.value.equipments?.some((equipment) => equipment.equipment?.title === choosenEquipment.value?.title)
);

function addWeight() {
  if (isAddWeightDisabled.value) return;

  choosenEquipmentWeights.value = [...choosenEquipmentWeights.value, Number(choosenEquipmentWeightInput.value)].sort();
}

function deleteWeight(weightToDelete: number) {
  choosenEquipmentWeights.value = choosenEquipmentWeights.value.filter((weight) => weight !== weightToDelete);
}

function addEquipment() {
  if (isAddEquipmentDisabled.value) return;

  formData.value.equipments = formData.value.equipments?.length
    ? [...formData.value.equipments, { equipment: choosenEquipment.value, weights: choosenEquipmentWeights.value }]
    : [{ equipment: choosenEquipment.value, weights: choosenEquipmentWeights.value }];

  resetEquipment();
}

function editEquipment(equipment: IUserEquipment) {
  isEditEquipment.value = true;

  choosenEquipment.value = equipment.equipment;
  choosenEquipmentWeightInput.value = 0;
  choosenEquipmentWeights.value = equipment.weights?.length ? [...equipment.weights] : [];
}

function saveEquipment() {
  formData.value.equipments = formData.value.equipments?.map((equipment) => {
    if (equipment.equipment?.title === choosenEquipment.value?.title) {
      return { equipment: choosenEquipment.value, weights: choosenEquipmentWeights.value };
    } else return equipment;
  });

  resetEquipment();

  isEditEquipment.value = false;
}

function deleteEquipment(title: string) {
  formData.value.equipments = formData.value.equipments?.filter((equipment) => equipment.equipment?.title !== title);
}

function resetEquipment() {
  choosenEquipment.value = undefined;
  choosenEquipmentWeightInput.value = 0;
  choosenEquipmentWeights.value = [];
}

const isAdmin = computed(() => props.user?.role === 'admin');

const { mutate: mutatePost, isPending: isLoadingPost } = userService.create({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success('Пользователь добавлен');
    router.push(URL_USER);
  },
});

const { mutate: mutateUpdate, isPending: isLoadingUpdate } = userService.update({
  onSuccess: async () => {
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success('Пользователь обновлен');
  },
});

const { mutate: mutateDelete } = userService.delete({
  onSuccess: async () => {
    queryClient.removeQueries({ queryKey: [API_USER] });
    await queryClient.refetchQueries({ queryKey: [API_USER] });
    toast.success('Пользователь удален');
    router.push(URL_USER);
  },
});

const rules = computed(() => {
  return {
    email: [required('ru'), email('ru')],
    name: required('ru'),
    password: !props.user?._id && required('ru'),
  };
});

const { error, isValid } = useValidator(formData, rules);

function submit() {
  if (!isValid()) return;

  if (props.user?._id) {
    mutateUpdate(formData.value);
  } else {
    mutatePost(formData.value);
  }
}

onMounted(() => {
  if (props.user) formData.value = clone(props.user);
});
</script>

<style module lang="scss">
.admin {
  font-weight: 700;
  color: var(--color-success);
}

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
