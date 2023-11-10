import { ApiOperationOptions } from '@nestjs/swagger';
import { ApiOperationTags } from '../tags';

// account management
export const createAccountAndUserApiOperation: ApiOperationOptions = {
  summary: 'Creates a new account and user',
  description:
    "The created user becomes the account's owner and gains highest level role",
  tags: [ApiOperationTags.AccountManagement],
};

export const createAccountIntegrationApiOperations: ApiOperationOptions = {
  summary: 'Add an integration to an account',
  description:
    'If requester has adequate permission, a new unconfigured account integration is created',
  tags: [ApiOperationTags.AccountIntegrationManagement],
};

export const getAccountIntegrationsOfTypeApiOperations: ApiOperationOptions = {
  summary: 'Retrieve account integrations of specified type',
  description:
    'If a requester has permission to edit account integrations, returns a list of integrations of the specified integration type',
  tags: [ApiOperationTags.AccountIntegrationManagement],
};
