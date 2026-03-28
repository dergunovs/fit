import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type FastifyInstance } from 'fastify';

import { createTestApp, generateTestToken } from '../common/test/createTestApp.js';
import { mockUser, mockAdmin, userId, mockUserService } from './mocks.js';

describe('User Routes', () => {
  let app: FastifyInstance;
  let userToken: string;
  let adminToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createTestApp({ userService: mockUserService });
    userToken = generateTestToken(app, mockUser);
    adminToken = generateTestToken(app, mockAdmin);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/user', () => {
    it('returns 403 for non-admin', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/user?page=1',
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(403);
    });

    it('returns users for admin', async () => {
      mockUserService.getMany.mockResolvedValue({ data: [mockUser], total: 1 });

      const res = await app.inject({
        method: 'GET',
        url: '/api/user?page=1',
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockUserService.getMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/user/:id', () => {
    it('returns 403 for non-admin', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/user/${userId}`,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(403);
    });

    it('returns user for admin', async () => {
      mockUserService.getOne.mockResolvedValue({ data: mockUser });

      const res = await app.inject({
        method: 'GET',
        url: `/api/user/${userId}`,
        headers: { authorization: `Bearer ${adminToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockUserService.getOne).toHaveBeenCalled();
    });
  });

  describe('POST /api/user', () => {
    it('returns 403 for non-admin', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/user',
        headers: { authorization: `Bearer ${userToken}` },
        body: { email: 'new@example.com', name: 'New User' },
      });

      expect(res.statusCode).toBe(403);
    });

    it('creates user for admin', async () => {
      mockUserService.create.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/user',
        headers: { authorization: `Bearer ${adminToken}` },
        body: { email: 'new@example.com', name: 'New User' },
      });

      expect(res.statusCode).toBe(201);
      expect(mockUserService.create).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/user/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/user/${userId}`,
        body: { email: 'test@example.com', name: 'Updated Name' },
      });

      expect(res.statusCode).toBe(403);
    });

    it('updates user for authenticated user', async () => {
      mockUserService.update.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/user/${userId}`,
        headers: { authorization: `Bearer ${userToken}` },
        body: { email: 'test@example.com', name: 'Updated Name' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockUserService.update).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/user_password/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/user_password/${userId}`,
        body: { password: 'newpassword123' },
      });

      expect(res.statusCode).toBe(403);
    });

    it('updates password for authenticated user', async () => {
      mockUserService.updatePassword.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/user_password/${userId}`,
        headers: { authorization: `Bearer ${userToken}` },
        body: { password: 'newpassword123' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockUserService.updatePassword).toHaveBeenCalled();
    });
  });

  describe('POST /api/user_feedback', () => {
    it('sends feedback', async () => {
      mockUserService.feedback.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/user_feedback',
        body: { name: 'Test User', email: 'test@example.com', message: 'Great app!' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockUserService.feedback).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('returns 403 without token', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: `/api/user/${userId}`,
      });

      expect(res.statusCode).toBe(403);
    });

    it('deletes user for authenticated user', async () => {
      mockUserService.delete.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/user/${userId}`,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockUserService.delete).toHaveBeenCalled();
    });
  });
});
