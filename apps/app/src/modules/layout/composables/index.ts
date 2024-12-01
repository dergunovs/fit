import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import LayoutAdmin from '@/layout/components/LayoutAdmin.vue';
import LayoutDefault from '@/layout/components/LayoutDefault.vue';

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
