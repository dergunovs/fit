// eslint-disable-next-line @typescript-eslint/no-unused-vars, sonarjs/unused-import
import { DefineLocaleMessage } from 'vue-i18n';

import { TMessageSchema } from '@/common/plugins/index';

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends TMessageSchema {}
}
