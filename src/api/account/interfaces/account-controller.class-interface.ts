import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../../../api/types';
export interface IAccountController {
  // General
  createAccountAndUser(body: unknown, response: FastifyReply): any;

  /**
   * *************************************************************
   * *** ACCOUNT INTEGRATION CONFIGURATION & SECRET MANAGEMENT ***
   * *************************************************************
   */
  upsertAccountIntegrationConfigValues(
    body: unknown,
    req: AuthenticatedRequest,
    res: FastifyReply,
  ): any;

  // Secrets
  upsertAccountSecret(
    body: unknown,
    req: AuthenticatedRequest,
    res: FastifyReply,
  ): any;

  // Users
  addUser(body: unknown, req: AuthenticatedRequest): any;
}
