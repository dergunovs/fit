import fs from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MultipartFields } from '@fastify/multipart';

import { error } from './errorHandler.ts';
import { createUploadService } from './service.ts';

class MockBusboyFileStream extends Readable {
  truncated = false;
  bytesRead = 0;
  private data: Buffer;

  constructor(data: Buffer = Buffer.from('')) {
    super();
    this.data = data;
  }

  _read(): void {
    this.push(this.data);
    this.push(null);
  }
}

interface MockFile {
  type: 'file';
  toBuffer: () => Promise<Buffer>;
  file: MockBusboyFileStream;
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  fields: MultipartFields;
}

vi.mock('node:fs');
vi.mock('node:stream/promises', () => ({
  pipeline: vi.fn(),
}));

describe('createUploadService', () => {
  const uploadService = createUploadService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('uploads image successfully', async () => {
      const mockFile: MockFile = {
        mimetype: 'image/jpeg',
        filename: 'test.jpg',
        fieldname: 'file',
        file: new MockBusboyFileStream(),
        encoding: '7bit',
        fields: {},
        toBuffer: () => Promise.resolve(Buffer.from('')),
        type: 'file' as const,
      };

      const mockPipeline = vi.mocked(pipeline);

      mockPipeline.mockResolvedValue(undefined);

      const mockCreateWriteStream = vi.mocked(fs.createWriteStream);

      mockCreateWriteStream.mockReturnValue({
        write: () => true,
        end: () => undefined,
        on: () => undefined,
      } as unknown as fs.WriteStream);

      const result = await uploadService.uploadImage(mockFile, '/upload/dir');

      expect(result).toMatch(/^\/upload\/\d+\.jpg$/);
      expect(fs.createWriteStream).toHaveBeenCalled();
      expect(pipeline).toHaveBeenCalled();
    });

    it('throws bad request for non-JPEG file', async () => {
      const mockFile: MockFile = {
        mimetype: 'image/png',
        filename: 'test.png',
        fieldname: 'file',
        file: new MockBusboyFileStream(),
        encoding: '7bit',
        fields: {},
        toBuffer: () => Promise.resolve(Buffer.from('')),
        type: 'file' as const,
      };

      await expect(uploadService.uploadImage(mockFile, '/upload/dir')).rejects.toThrow(error.badRequest().message);

      expect(pipeline).not.toHaveBeenCalled();
    });

    it('uploads image/jpg file successfully', async () => {
      const mockFile: MockFile = {
        mimetype: 'image/jpg',
        filename: 'test.jpg',
        fieldname: 'file',
        file: new MockBusboyFileStream(),
        encoding: '7bit',
        fields: {},
        toBuffer: () => Promise.resolve(Buffer.from('')),
        type: 'file' as const,
      };

      const mockPipeline = vi.mocked(pipeline);

      mockPipeline.mockResolvedValue(undefined);

      const mockCreateWriteStream = vi.mocked(fs.createWriteStream);

      mockCreateWriteStream.mockReturnValue({
        write: () => true,
        end: () => undefined,
        on: () => undefined,
      } as unknown as fs.WriteStream);

      const result = await uploadService.uploadImage(mockFile, '/upload/dir');

      expect(result).toMatch(/^\/upload\/\d+\.jpg$/);
    });
  });
});
