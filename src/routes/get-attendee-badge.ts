import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function getAttendeeBadge(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/attendees/:attendeeId/badge',
        {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number().int(),
                }),
                response: {
                    200: z.object({
                        badge: z.object({
                            name: z.string(),
                            email: z.string().email(),
                            eventTitle: z.string(),
                        }),
                    }),
                },
            },
        },
        async (req, res) => {
            const { attendeeId } = req.params;

            const attendee = await prisma.attendee.findUnique({
                select: {
                    name: true,
                    email: true,
                    event: {
                        select: {
                            title: true,
                        },
                    },
                },
                where: {
                    id: attendeeId,
                },
            });

            if (attendee === null) {
                throw new Error('Attendee not found!');
            }

            return res.status(200).send({
                badge: {
                    name: attendee.name,
                    email: attendee.email,
                    eventTitle: attendee.event.title,
                },
            });
        }
    );
}
