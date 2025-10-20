import { computed } from 'vue';
import { describe, it, expect } from 'vitest';
import {
  API_MUSCLE,
  TDeleteMuscleDTO,
  TGetMuscleDTO,
  TGetMusclesDTO,
  TPostMuscleDTO,
  TUpdateMuscleDTO,
} from 'fitness-tracker-contracts';

import { serviceMocks } from '@/common/mocks';
import { muscleService } from '@/muscle/services';
import { MUSCLES_FIXTURE, MUSCLE_FIXTURE } from '@/muscle/fixtures';
import { BASE_REPLY } from '@/common/fixtures';

const id = computed(() => '123');

describe('muscleService', () => {
  it('getAll', async () => {
    serviceMocks.http.mockGet<TGetMusclesDTO>({ data: MUSCLES_FIXTURE });
    muscleService.getAll();

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(MUSCLES_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_MUSCLE]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_MUSCLE);
  });

  it('getOne', async () => {
    serviceMocks.http.mockGet<TGetMuscleDTO>({ data: MUSCLE_FIXTURE });
    muscleService.getOne({}, id);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(MUSCLE_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_MUSCLE, id]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(`${API_MUSCLE}/${id.value}`);
  });

  it('getOne returns null when id is empty', async () => {
    const emptyId = computed(() => '');

    muscleService.getOne({}, emptyId);

    expect(await serviceMocks.lastQuery.queryFn()).toBeNull();
    expect(serviceMocks.http.get).not.toHaveBeenCalled();
  });

  it('create', async () => {
    serviceMocks.http.mockPost<TPostMuscleDTO>(BASE_REPLY);
    muscleService.create({});

    expect(await serviceMocks.lastMutation.mutationFn(MUSCLE_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_MUSCLE]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_MUSCLE, MUSCLE_FIXTURE);
  });

  it('update', async () => {
    serviceMocks.http.mockPatch<TUpdateMuscleDTO>(BASE_REPLY);
    muscleService.update({});

    expect(await serviceMocks.lastMutation.mutationFn(MUSCLE_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_MUSCLE]);
    expect(serviceMocks.http.patch).toHaveBeenCalledWith(`${API_MUSCLE}/${MUSCLE_FIXTURE._id}`, MUSCLE_FIXTURE);
  });

  it('delete', async () => {
    serviceMocks.http.mockDelete<TDeleteMuscleDTO>(BASE_REPLY);
    muscleService.delete({});

    expect(await serviceMocks.lastMutation.mutationFn(id.value)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_MUSCLE]);
    expect(serviceMocks.http.delete).toHaveBeenCalledWith(`${API_MUSCLE}/${id.value}`);
  });
});
