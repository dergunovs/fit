import { vi } from 'vitest';

import { IOnSuccess } from '@/common/interface';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';

interface IModuleMockConfig<T extends object | string = object | string> {
  service: { [key: string]: (...args: never[]) => unknown };
  fixtures: { one: T; many: T[] };
  queryMethodName?: string;
}

interface IOnSuccessCallback {
  onSuccess?: (...args: unknown[]) => Promise<void>;
}

export function createModuleMocks<T extends object | string = object | string>(config: IModuleMockConfig<T>) {
  const { service, fixtures, queryMethodName = 'getMany' } = config;

  const spyGetOne = vi.spyOn(service, 'getOne').mockReturnValue(mockQueryReply(fixtures.one));
  const spyGetMany = vi
    .spyOn(service, queryMethodName)
    .mockImplementation(() =>
      mockQueryReply(
        queryMethodName === 'getMany' ? { data: fixtures.many, total: fixtures.many.length } : fixtures.many
      )
    );

  const spyCreate = vi.fn();
  const spyUpdate = vi.fn();
  const spyDelete = vi.fn();

  const mockOnSuccess: IOnSuccess = {
    create: undefined,
    update: undefined,
    delete: undefined,
  };

  vi.spyOn(service, 'create').mockImplementation((options: unknown) => {
    const { onSuccess } = options as IOnSuccessCallback;

    if (onSuccess) mockOnSuccess.create = onSuccess;

    return mockMutationReply(spyCreate);
  });

  vi.spyOn(service, 'update').mockImplementation((options: unknown) => {
    const { onSuccess } = options as IOnSuccessCallback;

    if (onSuccess) mockOnSuccess.update = onSuccess;

    return mockMutationReply(spyUpdate);
  });

  vi.spyOn(service, 'delete').mockImplementation((options: unknown) => {
    const { onSuccess } = options as IOnSuccessCallback;

    if (onSuccess) mockOnSuccess.delete = onSuccess;

    return mockMutationReply(spyDelete);
  });

  return {
    spyGetOne,
    spyGetMany,
    spyCreate,
    spyUpdate,
    spyDelete,
    mockOnSuccess,
    mockGetManyData: { data: fixtures.many, total: fixtures.many.length },
  };
}
