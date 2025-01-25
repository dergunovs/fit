<template>
  <UiModal v-if="props.isAuth" v-model="isShowInstallPWA" width="380">
    <UiFlex column>
      <div>Установить приложение FiT на устройство?</div>

      <UiFlex>
        <UiButton @click="installPWA">Установить</UiButton>
        <UiButton @click="isShowInstallPWA = false" layout="secondary">Отмена</UiButton>
      </UiFlex>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';
import { IUser } from 'fitness-tracker-contracts';

interface IPromptEvent extends Event {
  prompt: () => Promise<void>;
}

interface IProps {
  isAuth: boolean;
  user?: IUser;
}

const props = defineProps<IProps>();

const isShowInstallPWA = ref(false);
const isPWACanBeInstalled = ref(false);
const installPWAPrompt = ref<IPromptEvent | undefined>();

function isInstallPromptEvent(e: Event): e is IPromptEvent {
  return Boolean(e) && 'prompt' in e;
}

function installHandler(event: Event) {
  if (isInstallPromptEvent(event)) {
    isPWACanBeInstalled.value = true;
    isShowInstallPWA.value = true;
    installPWAPrompt.value = event;
  }
}

function installPWA() {
  installPWAPrompt.value?.prompt();

  setTimeout(() => {
    isShowInstallPWA.value = false;
    installPWAPrompt.value = undefined;
  }, 100);
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', installHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', installHandler);
});
</script>
