export interface ISecretManagerProvider {
  upsertSecretVersion(secretId: string, secretValue: any): any;
  addSecretVersion(secretId: string, secretValue: any): any;
  createSecretContainer(secretId: string): any;
  getSecret(input: any): any;
  getSecretLocally(input: any): any;
  getRemoteSecret(input: any): any;
}
