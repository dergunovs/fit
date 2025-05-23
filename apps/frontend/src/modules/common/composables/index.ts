import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import LayoutAdmin from '@/common/components/LayoutAdmin.vue';
import LayoutDefault from '@/common/components/LayoutDefault.vue';

import IconExercise from '@/common/icons/exercise.svg?component';
import IconActivity from '@/common/icons/activity.svg?component';
import IconEquipment from '@/common/icons/weight.svg?component';
import IconMuscle from '@/common/icons/muscle.svg?component';
import IconUser from '@/common/icons/user.svg?component';

import { URL_USER, URL_USER_PROFILE } from '@/user/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { URL_ACTIVITY_ADMIN, URL_ACTIVITY_CREATE } from '@/activity/constants';
import { URL_EQUIPMENT } from '@/equipment/constants';
import { URL_MUSCLE } from '@/muscle/constants';
import { URL_HOME } from '@/common/constants';
import { INavItem } from '@/common/interface';

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

export function useLocale() {
  const { locale, availableLocales } = useI18n();

  function toggleLocale() {
    locale.value = availableLocales.find((l) => l !== locale.value) || locale.value;

    localStorage.setItem('locale', locale.value);
  }

  function initLocale() {
    if (localStorage.getItem('locale')) {
      locale.value = localStorage.locale;
    } else {
      const defaultLanguage = Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2);

      const isLanguageSupported = availableLocales.includes(defaultLanguage);

      if (isLanguageSupported) locale.value = defaultLanguage;
    }
  }

  onMounted(() => initLocale());

  return {
    toggleLocale,
    initLocale,
  };
}

export function useNavItems() {
  const { t } = useI18n();

  const NAV_ITEMS = computed(
    () =>
      [
        { url: URL_EXERCISE, title: t('exercise.many'), icon: IconExercise },
        { url: URL_ACTIVITY_ADMIN, title: t('activity.many'), icon: IconActivity },
        { url: URL_EQUIPMENT, title: t('equipment.one'), icon: IconEquipment },
        { url: URL_MUSCLE, title: t('muscle.many'), icon: IconMuscle },
        { url: URL_USER, title: t('user.many'), icon: IconUser },
      ] as INavItem[]
  );

  const BOTTOM_NAV_ITEMS = computed(
    () =>
      [
        { url: URL_HOME, title: t('statistics'), icon: IconActivity },
        { url: URL_ACTIVITY_CREATE, title: t('activity.one'), icon: IconExercise },
        { url: URL_USER_PROFILE, title: t('profile'), icon: IconUser },
      ] as INavItem[]
  );

  return { NAV_ITEMS, BOTTOM_NAV_ITEMS };
}
