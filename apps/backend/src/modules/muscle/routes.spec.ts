import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type FastifyInstance } from 'fastify';

import { createTestApp, generateTestToken } from '../common/test/createTestApp.ts';
import { mockUser, mockAdmin } from '../user/mocks.ts';
import { mockMuscleService, mockMuscle } from './mocks.ts';

const muscleId = 'muscle1';

describe('Muscle Routes', () => {
  let app: FastifyInstance;
  let adminToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createTestApp({ muscleService: mockMuscleService });
    adminToken = generateTestToken(app, mockAdmin);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/muscle', () => {
    it('returns all muscles', async () => {
      mockMuscleService.getAll.mockResolvedValue({ data: [mockMuscle] });

      const res = await app.inject({
        method: 'GET',
        url: '/api/muscle',
      });

      expect(res.statusCode).toBe(200);
      expect(mockMuscleService.getAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/muscle/:id', () => {
    it('returns muscle by id', async () => {
      mockMuscleService.getOne.mockResolvedValue({ data: mockMuscle });

      const res = await app.inject({
        method: 'GET',
        url: `/api/muscle/${muscleId}`,
      });

      expect(res.statusCode).toBe(200);
      expect(mockMuscleService.getOne).toHaveBeenCalled();
    });
  });

  describe('POST /api/muscle', () => {
    it('returns 403 for non-admin', async () => {
      const userToken = generateTestToken(app, mockUser);

      const res = await app.inject({
        method: 'POST',
        url: '/api/muscle',
        headers: { authorization: `Bearer ${userToken}` },
        body: { title: 'New Muscle', title_en: 'New Muscle', color: '#000000' },
      });

      expect(res.statusCode).toBe(403);
    });

    it('creates muscle for admin', async () => {
      mockMuscleService.create.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/muscle',
        headers: { authorization: `Bearer ${adminToken}` },
        body: { title: 'New Muscle', title_en: 'New Muscle', color: '#000000' },
      });

      expect(res.statusCode).toBe(201);
      expect(mockMuscleService.create).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/muscle/:id', () => {
    it('returns 403 for non-admin', async () => {
      const userToken = generateTestToken(app, mockUser);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/muscle/${muscleId}`,
        headers: { authorization: `Bearer ${userToken}` },
        body: { title: 'Updated Muscle', color: '#000000' },
      });

      expect(res.statusCode).toBe(403);
    });

    it('updates muscle for admin', async () => {
      mockMuscleService.update.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/muscle/${muscleId}`,
        headers: { authorization: `Bearer ${adminToken}` },
        body: { title: 'Updated Muscle', color: '#000000' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockMuscleService.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/muscle/:id', () => {
    it('returns 403 for non-admin', async () => {
      const userToken = generateTestToken(app, mockUser);

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/muscle/${muscleId}`,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(403);
    });

    it('deletes muscle for admin', async () => {
      mockMuscleService.delete.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/muscle/${muscleId}`,
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockMuscleService.delete).toHaveBeenCalled();
    });
  });
});
