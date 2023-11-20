import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../../../api/types';
export interface IAccountController {
  /**
   * **************************
   * *** ACCOUNT MANAGEMENT ***
   * **************************
   */
  createAccountAndUser(body: unknown, response: FastifyReply): any;

  /**
   * *************************************************************
   * *** ACCOUNT INTEGRATION CONFIGURATION & SECRET MANAGEMENT ***
   * *************************************************************
   */
  createAccountIntegration(body: unknown, req: AuthenticatedRequest): any;
  deactivateAccountIntegration(
    integrationType: string,
    accountIntegrationId: string,
    req: AuthenticatedRequest,
  ): any;
  activateAccountIntegration(
    integrationType: string,
    accountIntegrationId: string,
    req: AuthenticatedRequest,
  ): any;
  updateAccountIntegrationConfig(
    integrationType: string,
    accountIntegrationId: string,
    body: unknown,
    req: AuthenticatedRequest,
    res: FastifyReply,
  ): any;
  deleteAccountIntegration(
    integrationType: string,
    accountIntegrationId: string,
    req: AuthenticatedRequest,
  ): any;
  getAccountIntegrationConfiguration(
    integrationType: string,
    accountIntegrationId: string,
    req: AuthenticatedRequest,
  ): any;
  getAccountIntegrationConfigurations(
    req: AuthenticatedRequest,
    integrationType?: string,
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
