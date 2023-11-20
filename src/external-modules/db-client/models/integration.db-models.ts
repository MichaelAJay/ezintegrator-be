import {
  CrmIntegrationAction,
  CrmIntegrationAction as CrmIntegrationActionObject,
} from '@prisma/client';

// This should be a type union of all the *IntegrationAction types
export type IntegrationActionValues = CrmIntegrationAction;
export const CrmIntegrationActionConstant = CrmIntegrationActionObject;
export const crmIntegrationActions = Object.values(
  CrmIntegrationActionConstant,
);
