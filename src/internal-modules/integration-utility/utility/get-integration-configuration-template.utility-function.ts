import { UnprocessableEntityException } from '@nestjs/common';
import { IAccountIntegrationFieldConfigurationJson } from '../../account-and-caterer/interfaces/account-integration-fields.json-interface';
import * as Sentry from '@sentry/node';
import { validateAccountIntegrationConfigurationTemplateJSONArray } from '../../account-and-caterer/validators/account-integration-configuration-template.schema-and-validator';

export function getIntegrationConfigurationTemplate(
  integration: unknown,
): IAccountIntegrationFieldConfigurationJson[] {
  try {
    if (
      !validateAccountIntegrationConfigurationTemplateJSONArray(integration)
    ) {
      throw new UnprocessableEntityException(
        validateAccountIntegrationConfigurationTemplateJSONArray.errors,
      );
    }
    return integration;
  } catch (err) {
    Sentry.captureException(err);
    throw err;
  }
}
