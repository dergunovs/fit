import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const SWAGGER_HOST = 'localhost:5000';
const SWAGGER_TITLE = 'FiT swagger';
const SWAGGER_VERSION = '1.0.0';
const SWAGGER_DESCRIPTION = 'FiT on Github';
const SWAGGER_ROUTE_PREFIX = '/api-docs';

export default fp(async function (fastify) {
  fastify.register(swagger, {
    swagger: {
      info: { title: SWAGGER_TITLE, version: SWAGGER_VERSION },
      externalDocs: { url: 'https://github.com/dergunovs/fit', description: SWAGGER_DESCRIPTION },
      host: SWAGGER_HOST,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: { token: { type: 'apiKey', name: 'Authorization', in: 'header' } },
    },
  });

  if (process.env.IS_DEV) {
    fastify.register(swaggerUi, {
      routePrefix: SWAGGER_ROUTE_PREFIX,
      uiConfig: { docExpansion: 'list', defaultModelsExpandDepth: 0, tryItOutEnabled: true },
      logo: { type: 'image/svg+xml', content: '' },
    });
  }
});
