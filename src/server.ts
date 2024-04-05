import fastify from 'fastify';
import { ServerEnvs } from './config/envs';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createEvent } from './routes/create-event';
import { registerFprEvent } from './routes/register-for-event';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerFprEvent);

app
  .listen({ port: ServerEnvs.PORT })
  .then(() => console.log('HTTP server running!'));
