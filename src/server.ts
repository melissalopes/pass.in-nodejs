import fastify from 'fastify';
import { ServerEnvs } from './config/envs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { generateSlug } from './utils/generate-slug';

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

    const slug = generateSlug(data.title);

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug,
        }
    });

    return res.status(201).send(event);
});

app.listen({ port: ServerEnvs.PORT}).then(() => console.log('HTTP server running!'));
