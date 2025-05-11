import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async function (fastify) {
  fastify.register(cors, {
    origin: [`${process.env.APP_URL}`, 'tauri://localhost'],
    methods: 'GET,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });
});
