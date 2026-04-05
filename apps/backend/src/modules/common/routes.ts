import type { FastifyInstance } from 'fastify';
import { API_UPLOAD_IMAGE } from 'fitness-tracker-contracts';

import type { createUploadService } from './service.ts';
import { uploadImageSchema } from './schema.ts';

export function createUploadRoutes(deps: { uploadService: ReturnType<typeof createUploadService> }) {
  const { uploadService } = deps;

  return async function (fastify: FastifyInstance) {
    fastify.post(
      API_UPLOAD_IMAGE,
      { preValidation: [fastify.onlyAdmin], ...uploadImageSchema },
      async function (request, reply) {
        const uploadDir = process.env.UPLOAD_DIR;

        const file = await request.file({ limits: { fileSize: 10 * 1024 * 1024 } });

        if (!file) {
          reply.code(400).send({ message: 'File is required' });

          return;
        }

        if (!uploadDir) {
          reply.code(500).send({ message: 'Upload directory not configured' });

          return;
        }

        const url = await uploadService.uploadImage(file, uploadDir);

        reply.code(201).send({ url });
      }
    );
  };
}
