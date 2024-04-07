import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function getEventAttendees(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/events/:eventId/attendees',
        {
            schema: {
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                querystring: z.object({
                    pageIndex: z
                        .string()
                        .nullable()
                        .default('0')
                        .transform(Number),
                }),
                response: {
                    200: z.object({
                        attendees: z.array(
                            z.object({
                                id: z.number(),
                                name: z.string(),
                                email: z.string().email(),
                                createdAt: z.date(),
                                checkedInAt: z.date().nullable(),
                            })
                        ),
                    }),
                },
            },
        },
        async (req, res) => {
            const { eventId } = req.params;
            const { pageIndex } = req.query;

            const attendees = await prisma.attendee.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    CheckIn: {
                        select: {
                            createdAt: true,
                        },
                    },
                },
                where: {
                    eventId,
                },
                take: 10,
                skip: pageIndex * 10,
            });

            return res.status(200).send({
                attendees: attendees.map((attendee) => {
                    return {
                        id: attendee.id,
                        name: attendee.name,
                        email: attendee.email,
                        createdAt: attendee.createdAt,
                        checkedInAt: attendee.CheckIn?.createdAt ?? null,
                    };
                }),
            });
        }
    );
}