import { createI18n, I18nOptions } from 'vue-i18n';

import ru from '@/common/locales/ru.json';
import en from '@/common/locales/en.json';

const messages = { en, ru } as const;

const options: I18nOptions = { legacy: false, locale: 'ru', messages };

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type TMessageSchema = typeof en;

export const i18n = createI18n<false, typeof options>(options);
