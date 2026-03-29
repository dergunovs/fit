import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type FastifyInstance } from 'fastify';

import { mockUser } from '../user/mocks.ts';
import { createTestApp, generateTestToken } from '../common/test/createTestApp.ts';
import { mockAuthService } from './mocks.ts';

describe('Auth Routes', () => {
  let app: FastifyInstance;
  let userToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await createTestApp({ authService: mockAuthService });
    userToken = generateTestToken(app, mockUser);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/auth/check', () => {
    it('returns 401 without token', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/check',
      });

      expect(res.statusCode).toBe(401);
    });

    it('returns user data with valid token', async () => {
      mockAuthService.check.mockResolvedValue(mockUser);

      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/check',
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(200);
      expect(mockAuthService.check).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 200 on successful login', async () => {
      mockAuthService.login.mockResolvedValue({ user: mockUser, token: 'test-token' });

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        body: { email: 'test@example.com', password: 'password123' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockAuthService.login).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/setup', () => {
    it('returns 201 on successful setup', async () => {
      mockAuthService.setup.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/setup',
        body: { email: 'admin@example.com', password: 'admin123' },
      });

      expect(res.statusCode).toBe(201);
      expect(mockAuthService.setup).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/register', () => {
    it('returns 201 on successful registration', async () => {
      mockAuthService.register.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register?lang=en',
        body: { email: 'new@example.com', password: 'password123', name: 'New User' },
      });

      expect(res.statusCode).toBe(201);
      expect(mockAuthService.register).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/confirm', () => {
    it('returns 200 on successful confirmation', async () => {
      mockAuthService.confirm.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/confirm',
        body: { token: 'confirm-token' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockAuthService.confirm).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/reset', () => {
    it('returns 200 on successful reset', async () => {
      mockAuthService.reset.mockResolvedValue(undefined);

      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/reset?lang=en',
        body: { email: 'test@example.com' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockAuthService.reset).toHaveBeenCalled();
    });
  });
});
