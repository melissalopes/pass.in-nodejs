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

    const { title, details, maximumAttendees } = createEventSchema.parse(req.body);

    const slug = generateSlug(title);

    const eventWithSameSlug = await prisma.event.findUnique({
        where: {
            slug,
        }
    })

    if(eventWithSameSlug !==null){
        throw new Error('Another event with same slug already exists!')
    }

    const event = await prisma.event.create({
        data: {
            title,
            details,
            maximumAttendees,
            slug,
        }
    });

    return res.status(201).send(event);
});

app.listen({ port: ServerEnvs.PORT}).then(() => console.log('HTTP server running!'));
