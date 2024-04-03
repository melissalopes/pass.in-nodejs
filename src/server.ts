import fastify from 'fastify';
import { ServerEnvs } from './config/envs';

const app = fastify();

app.get('/', () => {
    return 'Hello world';
});

app.listen({ port: ServerEnvs.PORT}).then(() => console.log('HTTP server running!'));
