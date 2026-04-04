import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyInstance } from 'fastify';

import { API_UPLOAD_IMAGE } from 'fitness-tracker-contracts';
import type { ISchema } from './types.ts';

export const uploadImageSchema: ISchema = {
  schema: {
    tags: ['Upload'],
    summary: 'Загрузить изображение',
    response: {
      201: {
        type: 'object',
        properties: { url: { type: 'string' } },
        required: ['url'],
      },
    },
  },
};

export function createUploadRoutes() {
  return async function (fastify: FastifyInstance) {
    fastify.post(API_UPLOAD_IMAGE, { ...uploadImageSchema }, async function (request, reply) {
      try {
        const file = await request.file({ limits: { fileSize: 10 * 1024 * 1024 } });

        if (!file) {
          reply.code(400).send({ message: 'File is required' });

          return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg'];

        if (!allowedTypes.includes(file.mimetype)) {
          reply.code(400).send({ message: 'Only JPG/JPEG files are allowed' });

          return;
        }

        const timestamp = Date.now();
        const extension = '.jpg';
        const uploadedFilename = `${timestamp}${extension}`;
        const uploadDir = process.env.UPLOAD_DIR;

        if (!uploadDir) return;

        const filePath = path.join(uploadDir, uploadedFilename);

        await pipeline(file.file, fs.createWriteStream(filePath));

        reply.code(201).send({ url: `/upload/${uploadedFilename}` });
      } catch {
        reply.code(500).send({ message: 'Failed to save file' });
      }
    });
  };
}
