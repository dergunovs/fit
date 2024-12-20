import { beforeAll, vi } from 'vitest';
import * as helpers from 'mhz-helpers';
import { UseQueryReturnType, UseMutationReturnType } from 'mhz-helpers';

import { returnComputed } from './src/modules/common/test';

beforeAll(() => {
  vi.spyOn(helpers, 'useValidator').mockImplementation(() => {
    return {
      error: () => undefined,
      isValid: () => true,
      errors: returnComputed(undefined),
    };
  });

  vi.spyOn(helpers, 'api').mockImplementation(async () => Promise<unknown>);

  vi.spyOn(helpers, 'useQuery').mockImplementation(<T>(value: T) => value as unknown as UseQueryReturnType<T, Error>);

  vi.spyOn(helpers, 'useMutation').mockImplementation(
    <T, T2>(value: T) => value as unknown as UseMutationReturnType<T, Error, T2, unknown>
  );
});
