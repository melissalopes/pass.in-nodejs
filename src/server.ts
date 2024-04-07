import fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';
import { ServerEnvs } from './config/envs';
import {
    serializerCompiler,
    validatorCompiler,
    jsonSchemaTransform,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { createEvent } from './routes/create-event';
import { registerForEvent } from './routes/register-for-event';
import { getEvent } from './routes/get-event';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { checkIn } from './routes/check-in';
import { getEventAttendees } from './routes/get-event-attendees';
import { errorHandler } from './errors/error-handler';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
    origin: '*',
});

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'pass.in',
            description:
                'Especificações da API para o back-end da aplicação PASS.IN.',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

app.listen({ port: ServerEnvs.PORT }).then(() =>
    console.log('HTTP server running!')
);
