import { equipmentService } from '@/equipment/services';
import { createModuleMocks } from '@/common/mocks';
import { EQUIPMENT_FIXTURE, EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';

const base = createModuleMocks({
  service: equipmentService,
  fixtures: { one: EQUIPMENT_FIXTURE, many: EQUIPMENTS_FIXTURE },
  queryMethodName: 'getAll',
});

export const {
  spyGetOne: spyGetEquipment,
  spyGetMany: spyGetEquipments,
  spyCreate: spyCreateEquipment,
  spyUpdate: spyUpdateEquipment,
  spyDelete: spyDeleteEquipment,
  mockOnSuccess,
} = base;
