export interface IIntegrationClient {
  checkExternalConfiguration(args: any): Promise<boolean>;
  buildExternalCredentials(args: any): any;
}
