import { describe, it, expect, vi, beforeEach } from 'vitest';

import { testNotFoundScenario, testInvalidIdScenario } from '../common/test/testHelpers.js';
import { mockEquipmentRepository, mockEquipment, equipmentId } from './mocks.js';
import { createEquipmentService } from './service.js';

const service = createEquipmentService({ equipmentRepository: mockEquipmentRepository });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createEquipmentService', () => {
  describe('getAll', () => {
    it('returns all equipment', async () => {
      const mockData = [mockEquipment];

      mockEquipmentRepository.getAll.mockResolvedValue(mockData);

      const result = await service.getAll();

      expect(mockEquipmentRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual({ data: mockData });
    });

    it('returns empty array when no equipment exists', async () => {
      mockEquipmentRepository.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual({ data: [] });
    });
  });

  describe('getOne', () => {
    it('returns equipment when found', async () => {
      mockEquipmentRepository.getOne.mockResolvedValue(mockEquipment);

      const result = await service.getOne(equipmentId);

      expect(mockEquipmentRepository.getOne).toHaveBeenCalledWith(equipmentId);
      expect(result).toEqual({ data: mockEquipment });
    });

    testNotFoundScenario(service.getOne, mockEquipmentRepository.getOne, '507f1f77bcf86cd799439011');

    testInvalidIdScenario(service.getOne, 'invalid-id');
  });

  describe('create', () => {
    it('creates equipment successfully', async () => {
      mockEquipmentRepository.create.mockResolvedValue(undefined);

      await service.create(mockEquipment);

      expect(mockEquipmentRepository.create).toHaveBeenCalledWith(mockEquipment);
    });
  });

  describe('update', () => {
    it('updates equipment successfully', async () => {
      mockEquipmentRepository.updateOne.mockResolvedValue(undefined);

      await service.update(equipmentId, mockEquipment);

      expect(mockEquipmentRepository.updateOne).toHaveBeenCalledWith(equipmentId, mockEquipment);
    });

    testInvalidIdScenario(service.update, 'invalid-id', mockEquipment);
  });

  describe('delete', () => {
    it('deletes equipment successfully', async () => {
      mockEquipmentRepository.deleteOne.mockResolvedValue(undefined);

      await service.delete(equipmentId);

      expect(mockEquipmentRepository.deleteOne).toHaveBeenCalledWith(equipmentId);
    });

    testInvalidIdScenario(service.delete, 'invalid-id');
  });
});
