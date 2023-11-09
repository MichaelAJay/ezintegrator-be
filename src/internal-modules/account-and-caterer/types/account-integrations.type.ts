export const accountIntegration = {
  CRM: 'CRM',
  DEFAULT: 'DEFAULT',
} as const;

export type AccountIntegrationType =
  (typeof accountIntegration)[keyof typeof accountIntegration];

export const accountIntegrationValues = Object.values(
  accountIntegration,
) as Array<(typeof accountIntegration)[keyof typeof accountIntegration]>;
