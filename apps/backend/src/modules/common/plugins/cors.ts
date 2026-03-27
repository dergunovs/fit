import fp from 'fastify-plugin';
import cors from '@fastify/cors';

const CORS_METHODS = 'GET,PATCH,POST,DELETE,OPTIONS';
const CORS_HEADERS = 'Content-Type,Authorization';
const TAURI_ORIGIN = 'http://tauri.localhost';

export default fp(async function (fastify) {
  fastify.register(cors, {
    origin: [`${process.env.APP_URL}`, TAURI_ORIGIN],
    methods: CORS_METHODS,
    credentials: true,
    allowedHeaders: CORS_HEADERS,
  });
});
