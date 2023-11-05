import { Injectable, NotFoundException } from '@nestjs/common';
import { IBuildCreateAccountQueryArgs } from '../external-handlers/db-handlers/account-and-caterer.db-handler';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { IGetAuthAndRefreshTokens } from '../security-utility';
import { ICreateUserArgs } from '../user/interfaces';
import { UserService } from '../user/user.service';
import {
  IAccountAndCatererService,
  ICreateAccountAndUserArgs,
} from './interfaces';
import * as Sentry from '@sentry/node';
import { AccountIntegrationType } from './types';
import { CrmIntegrationDbHandlerService } from '../external-handlers/db-handlers/integrations/crm-integration.db-handler/crm-integration.db-handler.service';
import { getIntegrationConfigurationTemplate } from './utility/get-integration-configuration-template.utility-function';
import { IAccountIntegrationFieldConfigurationJson } from './interfaces/account-integration-fields.json-interface';

@Injectable()
export class AccountAndCatererService implements IAccountAndCatererService {
  constructor(
    private readonly accountAndCatererDbHandler: AccountAndCatererDbHandlerService,
    private readonly userService: UserService,
    private readonly crmIntegrationDbHandler: CrmIntegrationDbHandlerService,
  ) {}

  // Special note:  The accountOwner relation is CRUCIAL to get right.  If any part of this fails, I have to manually roll everything back, because
  // it can't be done in a transaction
  async createAccount(
    args: ICreateAccountAndUserArgs,
  ): Promise<IGetAuthAndRefreshTokens> {
    // Create account
    const createAccountArgs: IBuildCreateAccountQueryArgs = {
      name: args.accountName,
      ownerEmail: args.email,
      contactEmail: args.email,
    };
    const account = await this.accountAndCatererDbHandler.createAccount(
      createAccountArgs,
    );

    // Create user
    const createUserArgs: ICreateUserArgs = {
      email: args.email,
      firstName: args.firstName,
      accountId: account.id,
      password: args.password,
    };
    if (args.lastName) {
      createUserArgs.lastName = args.lastName;
    }
    // Await created user resolution - important for stack trace
    const { userId, tokens } = await this.userService.create(createUserArgs);

    try {
      await this.accountAndCatererDbHandler.assignAccountToOwner(
        account.id,
        userId,
      );
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setExtras({
          accountName: args.accountName,
          ownerEmail: args.email,
        });
        Sentry.captureException(err);
      });
      throw err;
    }

    return tokens;
  }

  // Integrations
  async getAccountIntegrations() {}

  async getAccountIntegrationConfigurationRequirements(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ): Promise<IAccountIntegrationFieldConfigurationJson[]> {
    let configurationRequirements: IAccountIntegrationFieldConfigurationJson[] =
      [];
    switch (integrationType) {
      case 'CRM':
        const crm = await this.crmIntegrationDbHandler.retrieveCrm(
          integrationId,
        );
        configurationRequirements = getIntegrationConfigurationTemplate(
          crm.configuration,
        );
        break;
      default:
        throw new NotFoundException(
          'No configuration requirements found for the provided integration type.',
        );
    }
    return configurationRequirements;
  }
}
