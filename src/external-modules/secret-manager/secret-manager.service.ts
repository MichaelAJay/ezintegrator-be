import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ISecretManagerProvider } from '.';
import * as Sentry from '@sentry/node';
import { getEnvironmentVariable } from '../../utility';

@Injectable()
export class SecretManagerService implements ISecretManagerProvider {
  private readonly projectName: string;

  constructor(
    @Inject('SecretManagerServiceClient')
    private readonly client: SecretManagerServiceClient,
  ) {
    this.projectName = getEnvironmentVariable('GCP_PROJECT');
  }

  async upsertSecretVersion(secretId: string, secretPayload: string | Buffer) {
    try {
      // Add secret version (assumes already versioned)
      await this.addSecretVersion(secretId, secretPayload);
    } catch (err) {
      if (err.message.includes('NOT_FOUND')) {
        await this.createSecretContainer(secretId);
        await this.addSecretVersion(secretId, secretPayload);
      } else {
        Sentry.captureException(err);
        throw err;
      }
    }
  }

  async createSecretContainer(secretId: string) {
    await this.client.createSecret({
      parent: `projects/${this.projectName}`,
      secretId,
      secret: {
        replication: {
          automatic: {},
        },
      },
    });
  }

  async addSecretVersion(secretId: string, secretPayload: string | Buffer) {
    // Convert if string here
    const payloadBuffer =
      typeof secretPayload === 'string'
        ? Buffer.from(secretPayload, 'utf8')
        : secretPayload;
    try {
      await this.client.addSecretVersion({
        parent: `projects/${this.projectName}/secrets/${secretId}`,
        payload: {
          data: payloadBuffer,
        },
      });
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    } finally {
      payloadBuffer.fill(0);
    }
  }

  async getSecret(secretName: string) {
    try {
      // @@ ts-ignore
      const IS_LOCAL = true;
      let secret: string;
      if (IS_LOCAL) {
        secret = await this.getSecretLocally(secretName);
      } else {
        secret = await this.getRemoteSecret(secretName);
      }
      return secret;
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setExtra('name', secretName);
        Sentry.captureException(err);
      });
      throw err;
    }
  }
  async getSecretLocally(secretName: string) {
    return 'LOCAL SECRET';
  }
  async getRemoteSecret(secretName: string) {
    const [version] = await this.client.accessSecretVersion({
      name: `projects/${this.projectName}/secrets/${secretName}/versions/latest`,
    });
    if (!(version && version.payload && version.payload.data)) {
      throw new InternalServerErrorException('Secret could not be retrieved');
    }
    return version.payload.data.toString();
  }
}
