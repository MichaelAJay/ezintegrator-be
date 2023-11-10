import { ApiOperationOptions } from '@nestjs/swagger';
import { ApiOperationTags } from '../tags';

/**
 * **************************
 * *** ACCOUNT MANAGEMENT ***
 * **************************
 */
export const createAccountAndUserApiOperation: ApiOperationOptions = {
  summary: 'Creates a new account and user',
  description:
    "The created user becomes the account's owner and gains highest level role",
  tags: [ApiOperationTags.AccountManagement],
};

/**
 * **************************************
 * *** ACCOUNT INTEGRATION MANAGEMENT ***
 * **************************************
 */
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

/**
 * *********************************
 * *** ACCOUNT SECRET MANAGEMENT ***
 * *********************************
 */

export const upsertAccountSecretApiOperations: ApiOperationOptions = {
  summary: 'Add a secret or add a new secret version',
  description:
    'If requester has "Edit Secrets" permission, creates a new secret & secret version & secret reference, or updates an existing secret',
  tags: [ApiOperationTags.AccountSecretManagement],
};

/**
 * *******************************
 * *** ACCOUNT USER MANAGEMENT ***
 * *******************************
 */
export const addUserApiOperations: ApiOperationOptions = {
  summary: 'Add a user to an account',
  description:
    'If requester has "Edit Users" permission and if email is not already in system, creates a new user',
  tags: [ApiOperationTags.AccountManagement],
};
