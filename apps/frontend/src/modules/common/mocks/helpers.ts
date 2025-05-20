import { computed, ref, Ref } from 'vue';
import { vi } from 'vitest';
import type { UseQueryReturnType, UseMutationReturnType } from 'mhz-helpers';
import * as helpers from 'mhz-helpers';

import * as commonHelpers from '@/common/helpers';

const mockDateFrom = ref('2024-11-24T21:00:00.000Z');
const mockDateTo = ref('2025-01-05T20:59:59.000Z');
const mockIsDatesReady = ref(true);
const spyUpdateDates = vi.fn();

const spyCopyToClipboard = vi.spyOn(commonHelpers, 'copyToClipboard');

function returnComputed<T>(value: T) {
  return computed(() => value);
}

const mockIsValid = ref(true);

vi.spyOn(helpers, 'useValidator').mockImplementation(() => {
  return { error: () => undefined, isValid: () => mockIsValid.value, errors: returnComputed(undefined) };
});

const spyUseCalendar = vi.spyOn(helpers, 'useCalendar').mockReturnValue({
  dateFrom: mockDateFrom,
  dateTo: mockDateTo,
  isDatesReady: mockIsDatesReady,
  updateDates: spyUpdateDates,
});

const spyUsePageLock = vi.spyOn(helpers, 'usePageLock');

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

const spyRefetchQueries = vi.fn();
const spyRemoveQueries = vi.fn();

vi.spyOn(helpers, 'useQueryClient').mockReturnValue({
  refetchQueries: spyRefetchQueries,
  removeQueries: spyRemoveQueries,
} as unknown as helpers.QueryClient);

const mockRouteId = computed(() => '123');

const spyUseRouteId = vi.spyOn(helpers, 'useRouteId').mockImplementation(() => {
  return { id: mockRouteId };
});

function mockQueryReply<T>(reply: object | string, refetch?: () => void) {
  return { data: ref(reply), refetch, isSuccess: true } as unknown as UseQueryReturnType<T, Error>;
}

function mockMutationReply<T, T2>(mutate: () => void) {
  return { mutate } as unknown as UseMutationReturnType<T, Error, T2, unknown>;
}

export {
  spyCopyToClipboard,
  spyAuth,
  spySetAuthHeaders,
  spyLogout,
  spyUsePageNumber,
  spyUsePagination,
  spySetPage,
  spyRefetchQueries,
  spyRemoveQueries,
  spyUpdateDates,
  spyUseCalendar,
  spyUsePageLock,
  spyUseRouteId,
  mockDateFrom,
  mockDateTo,
  mockIsDatesReady,
  mockIsValid,
  mockQueryReply,
  mockMutationReply,
  mockTempId,
  mockPageNumber,
  mockRouteId,
};
