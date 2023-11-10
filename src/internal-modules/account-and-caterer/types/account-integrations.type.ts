export enum AccountIntegration {
  CRM = 'CRM',
  DEFAULT = 'DEFAULT',
}

export type AccountIntegrationType = keyof typeof AccountIntegration;

export const accountIntegrationValues = Object.values(AccountIntegration);
