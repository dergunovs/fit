<template>
  <div :class="$style.container">
    <div>{{ props.title }}</div>

    <div :class="$style.repeats" :data-tall="props.isTall">
      <button
        v-for="repeat in props.options"
        :key="repeat"
        @click="updateValue(repeat)"
        type="button"
        :class="$style.button"
        :data-current="props.modelValue === repeat"
      >
        {{ repeat }}
      </button>

      <input
        type="number"
        :class="$style.input"
        :value="props.modelValue"
        @change="updateValue($event)"
        step="1"
        min="2"
        max="30"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  modelValue: number;
  options: number[];
  title: string;
  isTall?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);

function updateValue(value: number | Event) {
  emit('update:modelValue', typeof value === 'number' ? value : Number((value.target as HTMLInputElement).value));
}
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.repeats {
  display: flex;
  height: 40px;
  border: 1px solid var(--color-gray);
  border-radius: 16px;

  &[data-tall] {
    height: 52px;
  }
}

.button {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  background-color: var(--color-gray-light);
  border: none;

  &:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  &[data-current='true'] {
    color: var(--color-white);
    background-color: var(--color-accent-dark);
  }
}

.input {
  flex-grow: 1;
  min-width: 60px;
  max-width: 80px;
  font-size: 1rem;
  text-align: center;
  border: none;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  outline: none;
}
</style>
