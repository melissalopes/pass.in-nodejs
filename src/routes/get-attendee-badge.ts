import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendee/:attendeeId/badge',
    {
      schema: {
        params: z.object({
            attendeeId: z.coerce.number().int(),
          }),
        response: {},
        },
      },
    async (req, res) => {
      const { attendeeId } = req.params;

      return res.status(200).send({ });
    }
  );
}
