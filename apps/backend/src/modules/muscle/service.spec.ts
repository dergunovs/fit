import { describe, it, expect, vi, beforeEach } from 'vitest';

import { testNotFoundScenario, testInvalidIdScenario } from '../common/test/testHelpers.js';
import { mockMuscle, mockMuscle2, mockMuscleRepository } from './mocks.js';
import { createMuscleService } from './service.js';

const service = createMuscleService({ muscleRepository: mockMuscleRepository });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createMuscleService', () => {
  describe('getAll', () => {
    it('returns all muscles', async () => {
      const muscles = [mockMuscle, mockMuscle2];

      mockMuscleRepository.getAll.mockResolvedValue(muscles);

      const result = await service.getAll();

      expect(mockMuscleRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual({ data: muscles });
    });

    it('returns empty array when no muscles exist', async () => {
      mockMuscleRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual({ data: [] });
    });
  });

  describe('getOne', () => {
    it('returns muscle when found', async () => {
      mockMuscleRepository.getOne.mockResolvedValue(mockMuscle);

      const result = await service.getOne('507f1f77bcf86cd799439011');

      expect(mockMuscleRepository.getOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual({ data: mockMuscle });
    });

    testNotFoundScenario(service.getOne, mockMuscleRepository.getOne, '507f1f77bcf86cd799439011');

    testInvalidIdScenario(service.getOne, 'invalid-id');
  });

  describe('create', () => {
    it('creates muscle successfully', async () => {
      mockMuscleRepository.create.mockResolvedValue(undefined);

      await service.create(mockMuscle);

      expect(mockMuscleRepository.create).toHaveBeenCalledWith(mockMuscle);
    });
  });

  describe('update', () => {
    it('updates muscle successfully', async () => {
      mockMuscleRepository.updateOne.mockResolvedValue(undefined);

      await service.update('507f1f77bcf86cd799439011', mockMuscle);

      expect(mockMuscleRepository.updateOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011', mockMuscle);
    });

    testInvalidIdScenario(service.update, 'invalid-id', mockMuscle);
  });

  describe('delete', () => {
    it('deletes muscle successfully', async () => {
      mockMuscleRepository.deleteOne.mockResolvedValue(undefined);

      await service.delete('507f1f77bcf86cd799439011');

      expect(mockMuscleRepository.deleteOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    testInvalidIdScenario(service.delete, 'invalid-id');
  });
});
