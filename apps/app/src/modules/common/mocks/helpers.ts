import { ref } from 'vue';
import { vi } from 'vitest';
import type { UseQueryReturnType, UseMutationReturnType } from 'mhz-helpers';
import * as helpers from 'mhz-helpers';

const spyAuth = vi.fn();

vi.spyOn(helpers, 'useAuth').mockReturnValue({ auth: spyAuth, redirectIfAuth: () => undefined });

export { spyAuth };

export const spySetAuthHeaders = vi.spyOn(helpers, 'setAuthHeader');

export function mockQueryReply<T>(reply: object, refetch?: () => void) {
  return { data: ref(reply), refetch, isSuccess: true } as unknown as UseQueryReturnType<T, Error>;
}

export function mockMutationReply<T, T2>(mutate: () => void) {
  return { mutate } as unknown as UseMutationReturnType<T, Error, T2, unknown>;
}
