import {
  CrmIntegrationAction,
  CrmIntegrationAction as CrmIntegrationActionObject,
  CrmName,
  CrmName as CrmNameObject,
} from '@prisma/client';

// This should be a type union of all the *IntegrationAction types
export type IntegrationActionValues = CrmIntegrationAction;
export const CrmIntegrationActionConstant = CrmIntegrationActionObject;
export const crmIntegrationActions = Object.values(
  CrmIntegrationActionConstant,
);

export type CrmNameValues = CrmName;
export const CrmIntegrationNamesConstant = CrmNameObject;
export const crmIntegrationNames = Object.values(CrmIntegrationNamesConstant);

// All relevant integration names constants (*IntegrationNamesConstant) should be added to this constant
// Collisions should be avoided
export const IntegrationNamesConstant = {
  ...CrmIntegrationNamesConstant,
};
export type IntegrationNameValues = CrmNameValues | 'Assess';
export const integrationNames = Object.values(IntegrationNamesConstant);
