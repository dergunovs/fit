import { muscleService } from '@/muscle/services';
import { createModuleMocks } from '@/common/mocks';
import { MUSCLE_FIXTURE, MUSCLES_FIXTURE } from '@/muscle/fixtures';

const base = createModuleMocks({
  service: muscleService,
  fixtures: { one: MUSCLE_FIXTURE, many: MUSCLES_FIXTURE },
  queryMethodName: 'getAll',
});

export const {
  spyGetOne: spyGetMuscle,
  spyGetMany: spyGetMuscles,
  spyCreate: spyCreateMuscle,
  spyUpdate: spyUpdateMuscle,
  spyDelete: spyDeleteMuscle,
  mockOnSuccess,
} = base;
