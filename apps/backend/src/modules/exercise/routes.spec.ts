import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type FastifyInstance } from 'fastify';

import { createTestApp, generateTestToken } from '../common/test/createTestApp.js';
import { mockUser, mockAdmin } from '../user/mocks.js';
import { mockExerciseService, mockExercise } from './mocks.js';

const exerciseId = 'ex1';

describe('Exercise Routes', () => {
  let app: FastifyInstance;
  let userToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createTestApp({ exerciseService: mockExerciseService });
    userToken = generateTestToken(app, mockUser);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/exercise', () => {
    it('returns 403 for non-admin', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/exercise?page=1',
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(403);
    });

    it('returns exercises with pagination for admin', async () => {
      const adminToken = generateTestToken(app, mockAdmin);

      mockExerciseService.getMany.mockResolvedValue({ data: [mockExercise], total: 1 });

      const res = await app.inject({
        method: 'GET',
        url: '/api/exercise?page=1',
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockExerciseService.getMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/exercise_all', () => {
    it('returns 401 without token', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/exercise_all',
      });

      expect(res.statusCode).toBe(401);
    });

    it('returns all exercises for user', async () => {
      mockExerciseService.getAll.mockResolvedValue({ data: [mockExercise] });

      const res = await app.inject({
        method: 'GET',
        url: '/api/exercise_all',
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockExerciseService.getAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/exercise_custom', () => {
    it('returns 401 without token', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/exercise_custom',
      });

      expect(res.statusCode).toBe(401);
    });

    it('returns custom exercises for user', async () => {
      mockExerciseService.getCustom.mockResolvedValue({ data: [mockExercise] });

      const res = await app.inject({
        method: 'GET',
        url: '/api/exercise_custom',
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockExerciseService.getCustom).toHaveBeenCalled();
    });
  });

  describe('GET /api/exercise/:id', () => {
    it('returns exercise by id', async () => {
      mockExerciseService.getOne.mockResolvedValue({ data: mockExercise });

      const res = await app.inject({
        method: 'GET',
        url: `/api/exercise/${exerciseId}`,
      });

      expect(res.statusCode).toBe(200);
      expect(mockExerciseService.getOne).toHaveBeenCalled();
    });
  });

  describe('POST /api/exercise', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/exercise',
        body: { title: 'New Exercise', title_en: 'New Exercise', isWeights: false },
      });

      expect(res.statusCode).toBe(403);
    });

    it('creates exercise for user', async () => {
      mockExerciseService.create.mockResolvedValue('new-id');

      const res = await app.inject({
        method: 'POST',
        url: '/api/exercise',
        headers: { authorization: `Bearer ${userToken}` },
        body: { title: 'New Exercise', title_en: 'New Exercise', isWeights: false },
      });

      expect(res.statusCode).toBe(201);
      expect(mockExerciseService.create).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/exercise/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/exercise/${exerciseId}`,
        body: { title: 'Updated Exercise' },
      });

      expect(res.statusCode).toBe(403);
    });

    it('updates exercise for user', async () => {
      mockExerciseService.update.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/exercise/${exerciseId}`,
        headers: { authorization: `Bearer ${userToken}` },
        body: { title: 'Updated Exercise' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockExerciseService.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/exercise/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: `/api/exercise/${exerciseId}`,
      });

      expect(res.statusCode).toBe(403);
    });

    it('deletes exercise for user', async () => {
      mockExerciseService.delete.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/exercise/${exerciseId}`,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockExerciseService.delete).toHaveBeenCalled();
    });
  });
});
