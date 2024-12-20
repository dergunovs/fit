import { ref, Ref } from 'vue';
import { vi } from 'vitest';
import type { UseQueryReturnType, UseMutationReturnType } from 'mhz-helpers';
import * as helpers from 'mhz-helpers';

import { returnComputed } from '@/common/test';

const spyAuth = vi.fn();
const spySetPage = vi.fn();

vi.spyOn(helpers, 'useAuth').mockReturnValue({ auth: spyAuth, redirectIfAuth: () => undefined });

const pageNumber = ref(1);

const spyUsePageNumber = vi.spyOn(helpers, 'usePageNumber').mockReturnValue({
  page: pageNumber,
  setPage: spySetPage,
  resetPage: () => undefined,
});

const spyUsePagination = vi
  .spyOn(helpers, 'usePagination')
  .mockImplementation(<T>(dataRaw: Ref<{ data: T[]; total: number } | undefined>) => {
    return {
      data: returnComputed(dataRaw.value?.data),
      total: returnComputed(dataRaw.value?.total),
      setPaginationPage: () => 1,
    };
  });

const spySetAuthHeaders = vi.spyOn(helpers, 'setAuthHeader');
const spyLogout = vi.spyOn(helpers, 'logout');

function mockQueryReply<T>(reply: object, refetch?: () => void) {
  return { data: ref(reply), refetch, isSuccess: true } as unknown as UseQueryReturnType<T, Error>;
}

function mockMutationReply<T, T2>(mutate: () => void) {
  return { mutate } as unknown as UseMutationReturnType<T, Error, T2, unknown>;
}

export {
  spyAuth,
  spySetAuthHeaders,
  spyLogout,
  spyUsePageNumber,
  spyUsePagination,
  mockQueryReply,
  mockMutationReply,
  pageNumber,
  spySetPage,
};
