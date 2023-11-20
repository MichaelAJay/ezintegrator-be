import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAccountIntegrationProvider } from './interfaces';
import * as Sentry from '@sentry/node';
import { AccountIntegrationType } from './types';
import { AccountIntegrationDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { AccountCrmIntegratorService } from './integration-classes/account-crm-integrator.service';
import { AccountPermissionService } from '../security-utility/account-permission.service';
import { AccountIntegrationHelperService } from './account-integration-helper.service';
import { IAccountIntegration } from './interfaces/account-integration.interface';
import { mapAccountCrmToGeneralizedAccountIntegration } from './utility/account-integration/mappers/map-account-crm-to-generalized-account-integration.utility-mapper';
import { validateGeneralizedAccountIntegration } from './validators/generalized-account-integration.schema-and-validator';

// MAY NOT INJECT:
// AccountSecretService
@Injectable()
export class AccountIntegrationService implements IAccountIntegrationProvider {
  constructor(
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
    private readonly accountCrmIntegrator: AccountCrmIntegratorService,
    private readonly accountPermissionService: AccountPermissionService,
    private readonly accountIntegrationHelper: AccountIntegrationHelperService,
  ) {}

  /**
   * @TODO - the switch statement should return a uniform result so that the shape of the returned account integration is consistent
   * To do this, look at the way it's done for Create Account Integration
   *
   * Further, the account*Integrator retrieveOne is doing too much, and much of it is redundant
   * Try to write this in a way that the generalized return from retrieveOne can be used to determine
   * 1) Ownership is validated (account ownership)
   * 2) Check config status
   * 2a) If status doesn't match record's status, update to reflect check result
   */
  async getAccountIntegration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requester: {
      accountId: string;
      userId: string;
    },
  ) {
    let result: IAccountIntegration;
    switch (integrationType) {
      case 'CRM':
        const accountCrm = await this.accountCrmIntegrator.retrieveOne(
          accountIntegrationId,
          requester,
        );
        result = mapAccountCrmToGeneralizedAccountIntegration(
          accountCrm,
          'CRM',
        );
        break;
      default:
        const err = new UnprocessableEntityException();
        Sentry.withScope((scope) => {
          scope.setExtra('integrationType', integrationType);
          Sentry.captureException(err);
        });
        throw err;
    }

    return result;
  }

  async getAccountIntegrationsOfType(
    integrationType: AccountIntegrationType,
    accountId: string,
    requesterId: string,
  ) {
    // Check permission
    if (
      !(await this.accountPermissionService.doesUserHavePermission(
        requesterId,
        accountId,
        'EDIT_ACCOUNT_INTEGRATIONS',
      ))
    ) {
      throw new UnauthorizedException();
    }

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.retrieveAll(accountId);
      default:
        throw new BadRequestException('Invalid integration type');
    }
  }

  async createAccountIntegration(
    integrationType: AccountIntegrationType,
    integrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    if (
      !(await this.accountPermissionService.doesUserHavePermission(
        requesterId,
        accountId,
        'EDIT_ACCOUNT_INTEGRATIONS',
      ))
    ) {
      throw new UnauthorizedException();
    }

    let result;
    switch (integrationType) {
      case 'CRM':
        const createdCrm = await this.accountCrmIntegrator.create(
          integrationId,
          accountId,
        );
        result = mapAccountCrmToGeneralizedAccountIntegration(
          createdCrm,
          'CRM',
        );
        break;
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type.');
    }

    if (!validateGeneralizedAccountIntegration(result)) {
      const err = new InternalServerErrorException(
        'Created integration data did not match expected value',
      );
      Sentry.withScope((scope) => {
        scope.setExtra('errs', validateGeneralizedAccountIntegration.errors);
        Sentry.captureException(err);
      });
      throw err;
    }
    return result;
  }

  async updateAccountIntegrationConfig(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
    config: Record<string, any>,
  ) {
    /**
     * @OTODO replace permission checker
     */

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.updateConfig(
          accountIntegrationId,
          accountId,
          config,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  async deactivate(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    /**
     * @TODO replace permission checker
     */

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.deactivate(
          accountIntegrationId,
          accountId,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  async activate(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    /**
     * @TODO replace permission checker
     */

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.activate(
          accountIntegrationId,
          accountId,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  /**
   * @throws NotFoundException (record not found)
   * @throws ConflictException (record account doesn't match user account)
   * @throws UnprocessableEntityException (record is active)
   * @throws UnprocessableEntityException (record missing accountId)
   * @throws UnauthorizedException (requester lacks permission)
   */
  async delete(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    /**
     * @TODO fix permission checker
     */

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.delete(
          accountIntegrationId,
          accountId,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  async getAccountIntegrationConfiguration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requesterAccountId: string,
    requesterId: string,
  ) {}

  async getAccountIntegrationConfigurations(
    requesterId: string,
    requesterAccountId: string,
    integrationType?: AccountIntegrationType,
  ) {
    if (
      !(await this.accountPermissionService.doesUserHavePermission(
        requesterId,
        requesterAccountId,
        'EDIT_ACCOUNT_INTEGRATION_CONFIGURATION',
      ))
    ) {
      throw new UnauthorizedException();
    }
  }
}
