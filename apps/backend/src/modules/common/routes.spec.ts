import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';

import { mockUser } from '../user/mocks.ts';
import { mockUploadService } from './mocks.ts';
import { createTestApp, generateTestToken } from './test/createTestApp.ts';

describe('Upload Routes', () => {
  let app: FastifyInstance;
  let adminToken: string;
  let uploadDir: string;

  beforeAll(async () => {
    vi.clearAllMocks();
    uploadDir = process.env.UPLOAD_DIR || '/home/work/dev/fit-tracker/apps/backend/upload';
    process.env.UPLOAD_DIR = '/home/work/dev/fit-tracker/apps/backend/upload';
    app = await createTestApp({ uploadService: mockUploadService });
    const mockAdmin = {
      _id: 'admin123',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
      isResetPassword: false,
      dateLoggedIn: new Date(),
    };

    adminToken = generateTestToken(app, mockAdmin);
  });

  afterAll(async () => {
    process.env.UPLOAD_DIR = uploadDir;
    await app.close();
  });

  describe('POST /api/upload_image', () => {
    it('returns 403 for non-admin', async () => {
      const userToken = generateTestToken(app, mockUser);

      const res = await app.inject({
        method: 'POST',
        url: '/api/upload_image',
        headers: {
          authorization: `Bearer ${userToken}`,
          'content-type': 'multipart/form-data; boundary=----formdata-12345',
        },
        body: '------formdata-12345\r\nContent-Disposition: form-data; name="file"; filename="test.jpg"\r\nContent-Type: image/jpeg\r\n\r\ntest content\r\n------formdata-12345--\r\n',
      });

      expect(res.statusCode).toBe(403);
    });

    it('returns 400 when no file is provided', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/upload_image',
        headers: {
          authorization: `Bearer ${adminToken}`,
          'content-type': 'multipart/form-data; boundary=----formdata-12345',
        },
        body: '------formdata-12345\r\n------formdata-12345--\r\n',
      });

      expect(res.statusCode).toBe(400);
    });

    it('returns 500 when upload directory is not configured', async () => {
      const originalEnv = process.env.UPLOAD_DIR;

      delete process.env.UPLOAD_DIR;

      try {
        const res = await app.inject({
          method: 'POST',
          url: '/api/upload_image',
          headers: {
            authorization: `Bearer ${adminToken}`,
            'content-type': 'multipart/form-data; boundary=----formdata-12345',
          },
          body: '------formdata-12345\r\nContent-Disposition: form-data; name="file"; filename="test.jpg"\r\nContent-Type: image/jpeg\r\n\r\ntest content\r\n------formdata-12345--\r\n',
        });

        expect(res.statusCode).toBe(500);
      } finally {
        process.env.UPLOAD_DIR = originalEnv;
      }
    });

    it('uploads image successfully for admin', async () => {
      mockUploadService.uploadImage.mockResolvedValue('/upload/1234567890.jpg');

      const res = await app.inject({
        method: 'POST',
        url: '/api/upload_image',
        headers: {
          authorization: `Bearer ${adminToken}`,
          'content-type': 'multipart/form-data; boundary=----formdata-12345',
        },
        body: '------formdata-12345\r\nContent-Disposition: form-data; name="file"; filename="test.jpg"\r\nContent-Type: image/jpeg\r\n\r\ntest content\r\n------formdata-12345--\r\n',
      });

      expect(res.statusCode).toBe(201);
      expect(mockUploadService.uploadImage).toHaveBeenCalled();
      expect(JSON.parse(res.payload)).toEqual({ url: '/upload/1234567890.jpg' });
    });
  });
});
