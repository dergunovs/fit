import { computed, Ref } from 'vue';

import { useTI18n } from '@/common/composables';

export function useUserFormTabs(isEdit: boolean, isAdmin: Ref<boolean>) {
  const { t } = useTI18n();

  const generalTab = computed(() => {
    return { value: 'general', title: t('user.general') };
  });

  const exercisesTab = computed(() => {
    return { value: 'exercises', title: t('exercise.many') };
  });

  const otherTabs = computed(() => [
    { value: 'goals', title: t('goals') },
    { value: 'weight', title: t('weight') },
    { value: 'templates', title: t('template.many') },
  ]);

  const TABS = computed(() => {
    if (!isEdit) return [generalTab.value];
    if (isAdmin.value) return [generalTab.value, ...otherTabs.value];

    return [generalTab.value, ...otherTabs.value, exercisesTab.value];
  });

  return { TABS };
}
