export interface INutshellApiClientConfigurationService {
  generateClient(): Promise<any>;
  getApiForUsername(): any;
  selectDomain(): any;
  isGetApiForUsernameResponseValid(): any;
  getBasicAuthValue(): any;
  getUsernameAndApiKeyForAcct(): any;
}
