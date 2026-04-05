import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { MultipartFile } from '@fastify/multipart';

import { error } from './errorHandler.ts';

export function createUploadService() {
  return {
    async uploadImage(file: MultipartFile, uploadDir: string): Promise<string> {
      const allowedTypes = ['image/jpeg', 'image/jpg'];

      if (!allowedTypes.includes(file.mimetype)) {
        throw error.badRequest();
      }

      const timestamp = Date.now();
      const extension = '.jpg';
      const uploadedFilename = `${timestamp}${extension}`;
      const filePath = path.join(uploadDir, uploadedFilename);

      await pipeline(file.file, fs.createWriteStream(filePath));

      return `/upload/${uploadedFilename}`;
    },
  };
}
