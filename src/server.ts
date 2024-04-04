import fastify from 'fastify';
import { ServerEnvs } from './config/envs';
import { z } from 'zod';

const app = fastify();

app.post('/events', (req, res) => {

    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
    })

    const data = createEventSchema.parse(req.body);

    console.log(req.body);

    return 'Hello world';
});

app.listen({ port: ServerEnvs.PORT}).then(() => console.log('HTTP server running!'));
