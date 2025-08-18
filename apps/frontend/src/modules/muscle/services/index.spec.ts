import { describe, it, expect } from 'vitest';
import { API_MUSCLE } from 'fitness-tracker-contracts';

import { serviceMocks } from '@/common/mocks';
import { muscleService } from '@/muscle/services';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { BASE_REPLY } from '@/common/fixtures';

describe('muscleService', () => {
  it('get All', async () => {
    serviceMocks.http.mockGet({ data: MUSCLES_FIXTURE });
    muscleService.getAll();

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(MUSCLES_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_MUSCLE]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_MUSCLE);
  });

  it('create', async () => {
    serviceMocks.http.mockPost(BASE_REPLY);
    muscleService.create({});

    expect(await serviceMocks.lastMutation.mutationFn(MUSCLES_FIXTURE[0])).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_MUSCLE]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_MUSCLE, MUSCLES_FIXTURE[0]);
  });
});
