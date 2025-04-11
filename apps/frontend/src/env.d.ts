// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefineLocaleMessage } from 'vue-i18n';

import ru from '@/common/locales/ru.json';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>;
  export default component;
}

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-type-alias
  type TMessageSchema = typeof ru;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends TMessageSchema {}
}
