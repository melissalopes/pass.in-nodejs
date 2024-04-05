import fastify from 'fastify';
import { ServerEnvs } from './config/envs';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createEvemt } from './routes/create-event';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvemt);

app
  .listen({ port: ServerEnvs.PORT })
  .then(() => console.log('HTTP server running!'));
