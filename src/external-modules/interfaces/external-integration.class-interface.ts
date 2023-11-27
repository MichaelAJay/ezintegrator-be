// ALL external integration clients should implement this interface
export interface IExternalIntegrationProvider {
  /**
   * A lightweight check to ensure that an account integration is fully configured
   */
  checkConfiguration(args: any): Promise<boolean>;
}
