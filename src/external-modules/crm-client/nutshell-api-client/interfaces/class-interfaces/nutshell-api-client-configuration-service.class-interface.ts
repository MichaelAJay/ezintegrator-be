import { INutshellCredentials } from '../nutshell-credentials.interface';

export interface INutshellApiClientConfigurationService {
  generateClient(credentials: INutshellCredentials): Promise<any>;
  getApiForUsername(username: string, basicAuth: string): any;
}
