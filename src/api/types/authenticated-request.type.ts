import { FastifyRequest } from 'fastify';

export type AuthenticatedRequest = FastifyRequest & {
  userId: string;
  accountId: string;
};
