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
import { AccountPermissionService } from '../security-utility/account-permission.service';
import { AccountIntegrationHelperService } from './account-integration-helper.service';
import { IFullAccountIntegration } from './interfaces/account-integration.interface';
import { validateGeneralizedAccountIntegration } from './validators/generalized-account-integration.schema-and-validator';
import { AccountCrmIntegratorService } from './integration-classes/account-crm-integrator/account-crm-integrator.service';
import { AccountIntegrationMapperService } from './integration-classes/account-integration-mapper.service';

// MAY NOT INJECT:
// AccountSecretService
@Injectable()
export class AccountIntegrationService implements IAccountIntegrationProvider {
  constructor(
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
    private readonly accountCrmIntegrator: AccountCrmIntegratorService,
    private readonly accountPermissionService: AccountPermissionService,
    private readonly accountIntegrationHelper: AccountIntegrationHelperService,
    private readonly accountIntegrationMapper: AccountIntegrationMapperService,
  ) {}

  async getAccountIntegration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requester: {
      accountId: string;
      userId: string;
    },
  ) {
    let result: IFullAccountIntegration;
    switch (integrationType) {
      case 'CRM':
        const accountCrm = await this.accountCrmIntegrator.retrieveOne(
          accountIntegrationId,
          requester,
        );
        result =
          this.accountIntegrationMapper.mapAccountIntegrationToFullGeneralizedIntegration(
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

    if (result.accountId !== requester.accountId) {
      throw new UnauthorizedException();
    }

    const configStatus: any =
      this.accountIntegrationHelper.getAccountIntegrationConfigStatusAndMissingValues(
        result,
      );

    const ret: any = {
      ...result,
      ...configStatus,
    };

    delete ret.accountId;

    return ret;
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
        'EDIT_ACCOUNT_INTEGRATIONS',
      ))
    ) {
      throw new UnauthorizedException();
    }

    let result: IFullAccountIntegration;
    switch (integrationType) {
      case 'CRM':
        const createdCrm = await this.accountCrmIntegrator.create(
          integrationId,
          accountId,
        );
        result =
          this.accountIntegrationMapper.mapAccountIntegrationToFullGeneralizedIntegration(
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

    const ret: any =
      this.accountIntegrationHelper.getAccountIntegrationConfigStatusAndMissingValues(
        result,
      );
    delete ret.accountId;

    return ret;
  }

  async updateAccountIntegrationConfig(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requester: {
      accountId: string;
      userId: string;
    },
    configUpdate: Record<string, any>,
  ) {
    if (
      !(await this.accountPermissionService.canUserEditSecretsForAccount(
        requester.accountId,
        requester.userId,
      ))
    ) {
      throw new UnauthorizedException();
    }

    switch (integrationType) {
      case 'CRM':
        await this.accountCrmIntegrator.updateConfig(
          accountIntegrationId,
          requester.accountId,
          configUpdate,
        );
        break;
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
        'EDIT_ACCOUNT_INTEGRATION_CONFIGURATION',
      ))
    ) {
      throw new UnauthorizedException();
    }
  }
}
