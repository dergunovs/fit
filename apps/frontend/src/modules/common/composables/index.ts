import { computed, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { TLocale } from 'fitness-tracker-contracts';

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

export function useTI18n() {
  const { t, tm, rt, availableLocales, locale } = useI18n();

  return { t, tm, rt, availableLocales: availableLocales as TLocale[], locale: locale as Ref<TLocale> };
}

export function useLocale() {
  const { locale, availableLocales } = useTI18n();

  function toggleLocale() {
    locale.value = availableLocales.find((l) => l !== locale.value) || locale.value;

    localStorage.setItem('locale', locale.value);
  }

  function initLocale() {
    if (localStorage.getItem('locale')) {
      locale.value = localStorage.locale;
    } else {
      const defaultLanguage = Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2) as TLocale;

      const isLanguageSupported = availableLocales.includes(defaultLanguage);

      if (isLanguageSupported) locale.value = defaultLanguage;
    }
  }

  return {
    toggleLocale,
    initLocale,
  };
}

export function useNavItems() {
  const { t } = useTI18n();

  const NAV_ITEMS = computed<INavItem[]>(() => [
    { url: URL_EXERCISE, title: t('exercise.many'), icon: IconExercise },
    { url: URL_ACTIVITY_ADMIN, title: t('activity.many'), icon: IconActivity },
    { url: URL_EQUIPMENT, title: t('equipment.one'), icon: IconEquipment },
    { url: URL_MUSCLE, title: t('muscle.many'), icon: IconMuscle },
    { url: URL_USER, title: t('user.many'), icon: IconUser },
  ]);

  const BOTTOM_NAV_ITEMS = computed<INavItem[]>(() => [
    { url: URL_HOME, title: t('statistics'), icon: IconActivity },
    { url: URL_ACTIVITY_CREATE, title: t('activity.one'), icon: IconExercise },
    { url: URL_USER_PROFILE, title: t('profile'), icon: IconUser },
  ]);

  return { NAV_ITEMS, BOTTOM_NAV_ITEMS };
}
