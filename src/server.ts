import fastify from 'fastify';
import { ServerEnvs } from './config/envs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const app = fastify();

const prisma = new PrismaClient({
    log: ['query']
});

app.post('/events', async (req, res) => {

    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
    })

    const data = createEventSchema.parse(req.body);

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toISOString(),
        }
    });

    return event;
});

app.listen({ port: ServerEnvs.PORT}).then(() => console.log('HTTP server running!'));
