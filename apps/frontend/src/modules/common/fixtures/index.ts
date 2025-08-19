import { TLocale } from 'fitness-tracker-contracts';

export const BASE_REPLY = {
  message: 'Ok',
};

export const LANG_FIXTURE: TLocale = 'ru';

export function paginatedReply<T>(data: T) {
  return { data, total: 2 };
}
