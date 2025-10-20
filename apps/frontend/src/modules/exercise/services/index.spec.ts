import { computed } from 'vue';
import { describe, it, expect } from 'vitest';
import {
  API_EXERCISE,
  API_EXERCISE_ALL,
  API_EXERCISE_CUSTOM,
  TDeleteExerciseDTO,
  TGetExerciseDTO,
  TGetExercisesAllDTO,
  TGetExercisesCustomDTO,
  TGetExercisesDTO,
  TPostExerciseDTO,
  TUpdateExerciseDTO,
} from 'fitness-tracker-contracts';

import { serviceMocks } from '@/common/mocks';
import { exerciseService } from '@/exercise/services';
import { EXERCISES_FIXTURE, EXERCISE_FIXTURE } from '@/exercise/fixtures';
import { BASE_REPLY, paginatedReply } from '@/common/fixtures';

const page = computed(() => 1);
const id = computed(() => '123');

describe('exerciseService', () => {
  it('getMany', async () => {
    serviceMocks.http.mockGet<TGetExercisesDTO>(paginatedReply(EXERCISES_FIXTURE));
    exerciseService.getMany(page);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(paginatedReply(EXERCISES_FIXTURE));
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_EXERCISE, page]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_EXERCISE, { params: { page: page.value } });
  });

  it('getAll', async () => {
    serviceMocks.http.mockGet<TGetExercisesAllDTO>({ data: EXERCISES_FIXTURE });
    exerciseService.getAll();

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(EXERCISES_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_EXERCISE, API_EXERCISE_ALL]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_EXERCISE_ALL);
  });

  it('getCustom', async () => {
    serviceMocks.http.mockGet<TGetExercisesCustomDTO>({ data: EXERCISES_FIXTURE });
    exerciseService.getCustom({});

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(EXERCISES_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_EXERCISE, API_EXERCISE_CUSTOM]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_EXERCISE_CUSTOM);
  });

  it('getOne', async () => {
    serviceMocks.http.mockGet<TGetExerciseDTO>({ data: EXERCISE_FIXTURE });
    exerciseService.getOne({}, id);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(EXERCISE_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_EXERCISE, id]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(`${API_EXERCISE}/${id.value}`);
  });

  it('getOne returns null when id is empty', async () => {
    const emptyId = computed(() => '');

    exerciseService.getOne({}, emptyId);

    expect(await serviceMocks.lastQuery.queryFn()).toBeNull();
    expect(serviceMocks.http.get).not.toHaveBeenCalled();
  });

  it('create', async () => {
    serviceMocks.http.mockPost<TPostExerciseDTO>(BASE_REPLY);
    exerciseService.create({});

    expect(await serviceMocks.lastMutation.mutationFn(EXERCISE_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_EXERCISE]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_EXERCISE, EXERCISE_FIXTURE);
  });

  it('update', async () => {
    serviceMocks.http.mockPatch<TUpdateExerciseDTO>(BASE_REPLY);
    exerciseService.update({});

    expect(await serviceMocks.lastMutation.mutationFn(EXERCISE_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_EXERCISE]);
    expect(serviceMocks.http.patch).toHaveBeenCalledWith(`${API_EXERCISE}/${EXERCISE_FIXTURE._id}`, EXERCISE_FIXTURE);
  });

  it('delete', async () => {
    serviceMocks.http.mockDelete<TDeleteExerciseDTO>(BASE_REPLY);
    exerciseService.delete({});

    expect(await serviceMocks.lastMutation.mutationFn(id.value)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_EXERCISE]);
    expect(serviceMocks.http.delete).toHaveBeenCalledWith(`${API_EXERCISE}/${id.value}`);
  });
});
