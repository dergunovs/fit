import { IEquipment } from 'fitness-tracker-contracts';

export const EQUIPMENT_FIXTURE: IEquipment = {
  _id: '147456456',
  title: 'Гантели',
  isWeights: true,
  dateCreated: '2025-01-09T15:01:04.310Z',
  dateUpdated: '2025-01-10T10:42:06.333Z',
};

export const EQUIPMENT_FIXTURE_2: IEquipment = {
  _id: '245645645645',
  title: 'Скамья',
  dateCreated: '2025-01-10T12:35:59.559Z',
  isWeights: false,
};

export const EQUIPMENTS_FIXTURE: IEquipment[] = [EQUIPMENT_FIXTURE, EQUIPMENT_FIXTURE_2];
