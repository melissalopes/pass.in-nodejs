import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';
import { BadRequest } from '../errors/bad-request';

export async function getEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/events/:eventId',
        {
            schema: {
                summary: 'Get event',
                tags: ['events'],
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    200: z.object({
                        event: z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            slug: z.string(),
                            details: z.string().nullable(),
                            maximumAttendees: z.number().int().nullable(),
                            attendeesAmount: z.number().int(),
                        }),
                    }),
                },
            },
        },
        async (req, res) => {
            const { eventId } = req.params;

            const event = await prisma.event.findUnique({
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    details: true,
                    maximumAttendees: true,
                    _count: {
                        select: {
                            attendee: true,
                        },
                    },
                },
                where: {
                    id: eventId,
                },
            });

            if (event === null) {
                throw new BadRequest('Event not found!');
            }

            return res.status(200).send({
                event: {
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    details: event.details,
                    maximumAttendees: event.maximumAttendees,
                    attendeesAmount: event._count.attendee,
                },
            });
        }
    );
}
