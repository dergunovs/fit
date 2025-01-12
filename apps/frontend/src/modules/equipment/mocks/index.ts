import { vi } from 'vitest';
import {
  TDeleteEquipmentDTO,
  TPostEquipmentDataDTO,
  TPostEquipmentDTO,
  TUpdateEquipmentDataDTO,
  TUpdateEquipmentDTO,
} from 'fitness-tracker-contracts';

import { equipmentService } from '@/equipment/services';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import { EQUIPMENT_FIXTURE, EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { IOnSuccess } from '@/common/interface';

const spyGetEquipment = vi.spyOn(equipmentService, 'getOne').mockReturnValue(mockQueryReply(EQUIPMENT_FIXTURE));

const spyGetEquipments = vi
  .spyOn(equipmentService, 'getAll')
  .mockImplementation(() => mockQueryReply(EQUIPMENTS_FIXTURE));

const spyCreateEquipment = vi.fn();
const spyUpdateEquipment = vi.fn();
const spyDeleteEquipment = vi.fn();

const mockOnSuccess: IOnSuccess = {
  create: undefined,
  update: undefined,
  delete: undefined,
};

vi.spyOn(equipmentService, 'create').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.create = options.onSuccess;

  return mockMutationReply<TPostEquipmentDTO, TPostEquipmentDataDTO>(spyCreateEquipment);
});

vi.spyOn(equipmentService, 'update').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.update = options.onSuccess;

  return mockMutationReply<TUpdateEquipmentDTO, TUpdateEquipmentDataDTO>(spyUpdateEquipment);
});

vi.spyOn(equipmentService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteEquipmentDTO, string>(spyDeleteEquipment);
});

export { spyGetEquipment, spyGetEquipments, spyCreateEquipment, spyUpdateEquipment, spyDeleteEquipment, mockOnSuccess };
