import { createI18n, I18nOptions } from 'vue-i18n';

import ru from '@/common/locales/ru.json';
import en from '@/common/locales/en.json';

const options: I18nOptions = { legacy: false, locale: 'ru', messages: { ru, en } };

export const i18n = createI18n<false, typeof options>(options);
