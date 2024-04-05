import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId',
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (req, res) => {
      const { eventId } = req.params;

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      return res.status(201).send({ eventId: event.id });
    }
  );
}
