import { expect, it } from 'vitest';

export function testNotFoundScenario<TArgs extends unknown[], TResult>(
  serviceMethod: (...args: TArgs) => Promise<TResult>,
  mockRepositoryMethod: ReturnType<typeof import('vitest').vi.fn>,
  ...args: TArgs
) {
  it('throws not found when entity does not exist', async () => {
    mockRepositoryMethod.mockResolvedValue(null);

    await expect(serviceMethod(...args)).rejects.toThrow('Not found');
  });
}

export function testInvalidIdScenario<TArgs extends unknown[], TResult>(
  serviceMethod: (...args: TArgs) => Promise<TResult>,
  ...args: TArgs
) {
  it('throws bad request for invalid id', async () => {
    await expect(serviceMethod(...args)).rejects.toThrow('Bad request');
  });
}

export interface SuccessTestConfig<TArgs extends unknown[] = unknown[], TResult = unknown> {
  setupMocks: () => void;
  serviceMethod: (...args: TArgs) => Promise<TResult>;
  repositoryMethod?: ReturnType<typeof import('vitest').vi.fn>;
  ownerArgs: TArgs;
  adminArgs: TArgs;
}

export function testSuccessScenario<TArgs extends unknown[], TResult>(config: SuccessTestConfig<TArgs, TResult>) {
  it('succeeds for owner', async () => {
    config.setupMocks();

    await config.serviceMethod(...config.ownerArgs);

    if (config.repositoryMethod) {
      expect(config.repositoryMethod).toHaveBeenCalled();
    }
  });

  it('succeeds for admin', async () => {
    config.setupMocks();

    await config.serviceMethod(...config.adminArgs);

    if (config.repositoryMethod) {
      expect(config.repositoryMethod).toHaveBeenCalled();
    }
  });
}

export interface AccessDeniedTestConfig<TArgs extends unknown[] = unknown[], TResult = unknown> {
  setupMocks: () => void;
  serviceMethod: (...args: TArgs) => Promise<TResult>;
  mockRepository: { [key: string]: ReturnType<typeof import('vitest').vi.fn> };
  args: TArgs;
}

export function testAccessDeniedScenario<TArgs extends unknown[], TResult>(
  config: AccessDeniedTestConfig<TArgs, TResult>
) {
  it('throws forbidden for non-owner non-admin user', async () => {
    config.setupMocks();

    await expect(config.serviceMethod(...config.args)).rejects.toThrow('Access denied');
  });
}
