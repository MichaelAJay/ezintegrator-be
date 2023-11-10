import { ApiOperationOptions } from '@nestjs/swagger';
import { ApiOperationTags } from '../tags';

export const getIntegrationTypesApiOperationOptions: ApiOperationOptions = {
  summary: 'Retrieves general list of integration types, e.g. "CRM"',
  description:
    'Used to enable user to select an integration type to retrieve potential integration solutions of the specified type',
  tags: [ApiOperationTags.Integrations],
};

export const getIntegrationConfigurationTemplate: ApiOperationOptions = {
  summary: 'Retrieves configuration requirements for a specific integration',
  description:
    'Given a specific integration, retrieves the configuration requirements',
  tags: [ApiOperationTags.Integrations],
};

export const getIntegrationsOfType: ApiOperationOptions = {
  summary: 'Retrieves a list of integrations by type, e.g. "CRM"',
  description:
    'Used to enable user to select a specific integration from a list of integrations of the specified type',
  tags: [ApiOperationTags.Integrations],
};
