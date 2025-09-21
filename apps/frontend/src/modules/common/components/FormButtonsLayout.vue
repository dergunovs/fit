<template>
  <div>
    <div :class="$style.margin" v-if="props.isFixed" data-test="form-buttons-layout-margin"></div>

    <div :class="$style.buttons" :data-fixed="props.isFixed" data-test="form-buttons-layout-buttons">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  isFixed?: boolean;
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.margin {
  height: calc(var(--form-buttons-height) - 8px);
}

.buttons {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  width: 100%;

  &[data-fixed='true'] {
    position: fixed;
    bottom: 54px;
    left: 0;
    z-index: 1;
    width: 100%;
    height: var(--form-buttons-height);
    padding: 10px 12px;
    background-color: var(--color-white);
    border-top: 4px solid var(--color-gray);
  }
}

:global(.dark) {
  .buttons {
    &[data-fixed='true'] {
      background-color: var(--color-gray-dark-extra);
      border-top: 4px solid var(--color-accent);
    }
  }
}
</style>
