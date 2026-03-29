import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type FastifyInstance } from 'fastify';

import { createTestApp, generateTestToken } from '../common/test/createTestApp.ts';
import { mockUser, mockAdmin } from '../user/mocks.ts';
import { mockEquipmentService, mockEquipment, equipmentId } from './mocks.ts';

describe('Equipment Routes', () => {
  let app: FastifyInstance;
  let adminToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createTestApp({ equipmentService: mockEquipmentService });
    adminToken = generateTestToken(app, mockAdmin);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/equipment', () => {
    it('returns all equipment', async () => {
      mockEquipmentService.getAll.mockResolvedValue({ data: [mockEquipment] });

      const res = await app.inject({
        method: 'GET',
        url: '/api/equipment',
      });

      expect(res.statusCode).toBe(200);
      expect(mockEquipmentService.getAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/equipment/:id', () => {
    it('returns equipment by id', async () => {
      mockEquipmentService.getOne.mockResolvedValue({ data: mockEquipment });

      const res = await app.inject({
        method: 'GET',
        url: `/api/equipment/${equipmentId}`,
      });

      expect(res.statusCode).toBe(200);
      expect(mockEquipmentService.getOne).toHaveBeenCalled();
    });
  });

  describe('POST /api/equipment', () => {
    it('returns 403 for non-admin', async () => {
      const userToken = generateTestToken(app, mockUser);

      const res = await app.inject({
        method: 'POST',
        url: '/api/equipment',
        headers: { authorization: `Bearer ${userToken}` },
        body: { title: 'New Equipment', isWeights: false },
      });

      expect(res.statusCode).toBe(403);
    });

    it('creates equipment for admin', async () => {
      mockEquipmentService.create.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/equipment',
        headers: { authorization: `Bearer ${adminToken}` },
        body: { title: 'New Equipment', isWeights: false },
      });

      expect(res.statusCode).toBe(201);
      expect(mockEquipmentService.create).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/equipment/:id', () => {
    it('returns 403 for non-admin', async () => {
      const userToken = generateTestToken(app, mockUser);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/equipment/${equipmentId}`,
        headers: { authorization: `Bearer ${userToken}` },
        body: { title: 'Updated Equipment', isWeights: false },
      });

      expect(res.statusCode).toBe(403);
    });

    it('updates equipment for admin', async () => {
      mockEquipmentService.update.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/equipment/${equipmentId}`,
        headers: { authorization: `Bearer ${adminToken}` },
        body: { title: 'Updated Equipment', isWeights: false },
      });

      expect(res.statusCode).toBe(200);
      expect(mockEquipmentService.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/equipment/:id', () => {
    it('returns 403 for non-admin', async () => {
      const userToken = generateTestToken(app, mockUser);

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/equipment/${equipmentId}`,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(403);
    });

    it('deletes equipment for admin', async () => {
      mockEquipmentService.delete.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/equipment/${equipmentId}`,
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockEquipmentService.delete).toHaveBeenCalled();
    });
  });
});
