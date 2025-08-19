import { computed } from 'vue';
import { describe, it, expect } from 'vitest';
import {
  API_EQUIPMENT,
  TDeleteEquipmentDTO,
  TGetEquipmentDTO,
  TGetEquipmentsDTO,
  TPostEquipmentDTO,
  TUpdateEquipmentDTO,
} from 'fitness-tracker-contracts';

import { serviceMocks } from '@/common/mocks';
import { equipmentService } from '@/equipment/services';
import { EQUIPMENTS_FIXTURE, EQUIPMENT_FIXTURE } from '@/equipment/fixtures';
import { BASE_REPLY } from '@/common/fixtures';

const id = computed(() => '123');

describe('equipmentService', () => {
  it('getAll', async () => {
    serviceMocks.http.mockGet<TGetEquipmentsDTO>({ data: EQUIPMENTS_FIXTURE });
    equipmentService.getAll();

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(EQUIPMENTS_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_EQUIPMENT]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_EQUIPMENT);
  });

  it('getOne', async () => {
    serviceMocks.http.mockGet<TGetEquipmentDTO>({ data: EQUIPMENT_FIXTURE });
    equipmentService.getOne({}, id);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(EQUIPMENT_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_EQUIPMENT, id]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(`${API_EQUIPMENT}/${id.value}`);
  });

  it('create', async () => {
    serviceMocks.http.mockPost<TPostEquipmentDTO>(BASE_REPLY);
    equipmentService.create({});

    expect(await serviceMocks.lastMutation.mutationFn(EQUIPMENT_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_EQUIPMENT]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_EQUIPMENT, EQUIPMENT_FIXTURE);
  });

  it('update', async () => {
    serviceMocks.http.mockPatch<TUpdateEquipmentDTO>(BASE_REPLY);
    equipmentService.update({});

    expect(await serviceMocks.lastMutation.mutationFn(EQUIPMENT_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_EQUIPMENT]);
    expect(serviceMocks.http.patch).toHaveBeenCalledWith(
      `${API_EQUIPMENT}/${EQUIPMENT_FIXTURE._id}`,
      EQUIPMENT_FIXTURE
    );
  });

  it('delete', async () => {
    serviceMocks.http.mockDelete<TDeleteEquipmentDTO>(BASE_REPLY);
    equipmentService.delete({});

    expect(await serviceMocks.lastMutation.mutationFn(id.value)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_EQUIPMENT]);
    expect(serviceMocks.http.delete).toHaveBeenCalledWith(`${API_EQUIPMENT}/${id.value}`);
  });
});
