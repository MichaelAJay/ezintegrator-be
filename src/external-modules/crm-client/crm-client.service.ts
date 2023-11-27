import { Injectable } from '@nestjs/common';
import { IntegrationNameValues } from '../db-client';
import { IIntegrationClient } from '../interfaces/crm-client.class-interface';
import * as Sentry from '@sentry/node';
import { NutshellApiClientService } from './nutshell-api-client/nutshell-api-client.service';
import { ValidationError } from '../../common/errors/validation-error';
import { nutshellCredentialsValidator } from './validators/nutshell-credentials.schema-and-validator';

@Injectable()
export class CrmClientService implements IIntegrationClient {
  constructor(private readonly nutshellApiClient: NutshellApiClientService) {}
  async checkExternalConfiguration(args: {
    integrationName: IntegrationNameValues;
    nonSensitiveCredentials: any;
    secrets: any;
  }): Promise<boolean> {
    const { integrationName, nonSensitiveCredentials, secrets } = args;
    const credentials = this.buildExternalCredentials(args);
    let result: any;
    switch (integrationName) {
      case 'NUTSHELL':
        if (!nutshellCredentialsValidator(credentials)) {
          throw new ValidationError('adf', nutshellCredentialsValidator.errors);
        }
        result = await this.nutshellApiClient.checkConfiguration(credentials);
        break;
      default:
        const err = new Error('Invalid integration name');
        Sentry.withScope((scope) => {
          scope.setExtra('name', integrationName);
          Sentry.captureException(err);
        });
        throw err;
    }

    return result;
  }

  buildExternalCredentials(args: {
    integrationName: IntegrationNameValues;
    nonSensitiveCredentials: any;
    secrets: any;
  }): any {
    const { integrationName, nonSensitiveCredentials, secrets } = args;
    switch (integrationName) {
      case 'NUTSHELL':
        return this.nutshellApiClient.buildCredentials(
          nonSensitiveCredentials,
          secrets,
        );
      default:
        const err = new Error('Invalid integration name');
        Sentry.withScope((scope) => {
          scope.setExtra('name', integrationName);
          Sentry.captureException(err);
        });
        throw err;
    }
  }
}
