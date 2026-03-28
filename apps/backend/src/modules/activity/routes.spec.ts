import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type FastifyInstance } from 'fastify';

import { mockUser, mockAdmin } from '../user/mocks.js';
import { createTestApp, generateTestToken } from '../common/test/createTestApp.js';
import { mockActivityService, mockActivity, activityId } from './mocks.js';

describe('Activity Routes', () => {
  let app: FastifyInstance;
  let userToken: string;
  let adminToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createTestApp({ activityService: mockActivityService });
    userToken = generateTestToken(app, mockUser);
    adminToken = generateTestToken(app, mockAdmin);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/activity', () => {
    it('returns 403 for non-admin', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/activity?page=1',
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(403);
    });

    it('returns activities for admin', async () => {
      mockActivityService.getMany.mockResolvedValue({ data: [mockActivity], total: 1 });

      const res = await app.inject({
        method: 'GET',
        url: '/api/activity?page=1',
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockActivityService.getMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/activity_calendar', () => {
    it('returns calendar data', async () => {
      mockActivityService.getCalendar.mockResolvedValue([mockActivity]);

      const res = await app.inject({
        method: 'GET',
        url: '/api/activity_calendar?dateFrom=2024-01-01&dateTo=2024-01-31',
      });

      expect(res.statusCode).toBe(200);
      expect(mockActivityService.getCalendar).toHaveBeenCalled();
    });
  });

  describe('GET /api/activity_statistics', () => {
    it('returns statistics data', async () => {
      mockActivityService.getStatistics.mockResolvedValue({
        activity: {
          activitiesCount: { cur: 0, dynamics: 0 },
          setsCount: { cur: 0, dynamics: 0 },
          repeatsCount: { cur: 0, dynamics: 0 },
          duration: { cur: 0, dynamics: 0 },
          averageSetsPerActivity: { cur: 0, dynamics: 0 },
          averageRepeatsPerSet: { cur: 0, dynamics: 0 },
          averageDuration: { cur: 0, dynamics: 0 },
          averageRestPercent: { cur: 0, dynamics: 0 },
        },
        exercise: [],
      });

      const res = await app.inject({
        method: 'GET',
        url: '/api/activity_statistics?gap=7',
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockActivityService.getStatistics).toHaveBeenCalled();
    });
  });

  describe('GET /api/activity_chart', () => {
    it('returns chart data', async () => {
      mockActivityService.getChart.mockResolvedValue({ labels: [], datasets: [] });

      const res = await app.inject({
        method: 'GET',
        url: '/api/activity_chart?type=muscle&month=false&average=false&locale=en',
      });

      expect(res.statusCode).toBe(200);
      expect(mockActivityService.getChart).toHaveBeenCalled();
    });
  });

  describe('GET /api/activity/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/activity/${activityId}`,
      });

      expect(res.statusCode).toBe(403);
    });

    it('returns activity for user', async () => {
      mockActivityService.getOne.mockResolvedValue({ data: mockActivity });

      const res = await app.inject({
        method: 'GET',
        url: `/api/activity/${activityId}`,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockActivityService.getOne).toHaveBeenCalled();
    });
  });

  describe('POST /api/activity', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/activity',
        body: { exercises: [], isDone: false },
      });

      expect(res.statusCode).toBe(403);
    });

    it('creates activity for user', async () => {
      mockActivityService.create.mockResolvedValue('new-id');

      const res = await app.inject({
        method: 'POST',
        url: '/api/activity',
        headers: { authorization: `Bearer ${userToken}` },
        body: { exercises: [], isDone: false },
      });

      expect(res.statusCode).toBe(201);
      expect(mockActivityService.create).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/activity/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/activity/${activityId}`,
        body: { exercises: [], isDone: true },
      });

      expect(res.statusCode).toBe(403);
    });

    it('updates activity for user', async () => {
      mockActivityService.update.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/activity/${activityId}`,
        headers: { authorization: `Bearer ${userToken}` },
        body: { exercises: [], isDone: true },
      });

      expect(res.statusCode).toBe(200);
      expect(mockActivityService.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/activity/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: `/api/activity/${activityId}`,
      });

      expect(res.statusCode).toBe(403);
    });

    it('deletes activity for user', async () => {
      mockActivityService.delete.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/activity/${activityId}`,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockActivityService.delete).toHaveBeenCalled();
    });
  });
});
