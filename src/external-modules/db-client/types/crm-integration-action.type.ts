import {
  CrmIntegrationAction,
  CrmIntegrationAction as CrmIntegrationActionConstant,
} from '@prisma/client';

export type CrmIntegrationActionValues = CrmIntegrationAction;
export const AllCrmIntegrationActions = CrmIntegrationActionConstant;
export const crmIntegrationActions = Object.values(AllCrmIntegrationActions);
