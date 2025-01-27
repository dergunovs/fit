import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import LayoutAdmin from '@/common/components/LayoutAdmin.vue';
import LayoutDefault from '@/common/components/LayoutDefault.vue';

import { IPromptEvent } from '@/common/interface';

export function useLayout() {
  const router = useRouter();
  const route = useRoute();

  const isLoaded = ref(false);

  const layoutComponent = computed(() => (route.meta.layout === 'admin' ? LayoutAdmin : LayoutDefault));

  onMounted(async () => {
    await router.isReady();
    isLoaded.value = true;
  });

  return {
    isLoaded,
    layoutComponent,
  };
}

export function usePWA() {
  const isShowInstallPWA = ref(false);
  const isPWACanBeInstalled = ref(false);
  const installPWAPrompt = ref<IPromptEvent | undefined>();

  async function installPWA() {
    await installPWAPrompt.value?.prompt();

    setTimeout(() => {
      isShowInstallPWA.value = false;
      installPWAPrompt.value = undefined;
    }, 100);
  }

  function isInstallPromptEvent(e: Event): e is IPromptEvent {
    return !!e && 'prompt' in e;
  }

  function installHandler(event: Event) {
    if (isInstallPromptEvent(event)) {
      isPWACanBeInstalled.value = true;
      isShowInstallPWA.value = true;
      installPWAPrompt.value = event;
    }
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', installHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', installHandler);
  });

  return {
    installPWA,
    isShowInstallPWA,
  };
}
