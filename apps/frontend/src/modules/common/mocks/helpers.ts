import { ref, Ref } from 'vue';
import { vi } from 'vitest';
import type { UseQueryReturnType, UseMutationReturnType } from 'mhz-helpers';
import * as helpers from 'mhz-helpers';

import { returnComputed } from '@/common/test';

const mockIsValid = ref(true);

vi.spyOn(helpers, 'useValidator').mockImplementation(() => {
  return {
    error: () => undefined,
    isValid: () => mockIsValid.value,
    errors: returnComputed(undefined),
  };
});

const mockTempId = 'fd98bye9rbrube';

vi.spyOn(helpers, 'createTempId').mockReturnValue(mockTempId);

const spyAuth = vi.fn();

vi.spyOn(helpers, 'useAuth').mockReturnValue({ auth: spyAuth, redirectIfAuth: () => undefined });

const spySetAuthHeaders = vi.spyOn(helpers, 'setAuthHeader');
const spyLogout = vi.spyOn(helpers, 'logout');

const mockPageNumber = ref(1);
const spySetPage = vi.fn();

const spyUsePageNumber = vi.spyOn(helpers, 'usePageNumber').mockReturnValue({
  page: mockPageNumber,
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

vi.spyOn(helpers, 'api').mockImplementation(async () => Promise<unknown>);

vi.spyOn(helpers, 'useQuery').mockImplementation(<T>(value: T) => value as unknown as UseQueryReturnType<T, Error>);

vi.spyOn(helpers, 'useMutation').mockImplementation(
  <T, T2>(value: T) => value as unknown as UseMutationReturnType<T, Error, T2, unknown>
);

const spyRefetchQueries = vi.fn();
const spyRemoveQueries = vi.fn();

vi.spyOn(helpers, 'useQueryClient').mockReturnValue({
  refetchQueries: spyRefetchQueries,
  removeQueries: spyRemoveQueries,
} as unknown as helpers.QueryClient);

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
  spySetPage,
  spyRefetchQueries,
  spyRemoveQueries,
  mockIsValid,
  mockQueryReply,
  mockMutationReply,
  mockTempId,
  mockPageNumber,
};
