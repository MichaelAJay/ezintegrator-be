import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SecretManagerService } from '../../secret-manager/secret-manager.service';
import {
  INutshellApiClientConfigurationService,
  INutshellCredentials,
} from '.';
import * as jayson from 'jayson/promise';
import { generateBasicAuth } from '../../../utility';
import * as Sentry from '@sentry/node';
import { validateGetApiForUsernameNutshellResponse } from './validation/nutshell-api-responses';
import { NutshellApiCacheService } from './nutshell-api-cache.service';

@Injectable()
export class NutshellApiClientConfigurationService
  implements INutshellApiClientConfigurationService
{
  constructor(
    private readonly secretManager: SecretManagerService,
    private readonly cache: NutshellApiCacheService,
  ) {}
  async generateClient({ username, apiKeySecretName }: INutshellCredentials) {
    const apiKey = await this.secretManager.getSecret(apiKeySecretName);
    const basicAuth = generateBasicAuth(username, apiKey);

    const host = await this.getApiForUsername(username, basicAuth);
    return jayson.Client.https({
      host,
      path: '/api/v1/json',
      headers: {
        Authorization: basicAuth,
      },
    });
  }
  async getApiForUsername(username: string, basicAuth: string) {
    // Check cache & return if cached
    const userCachedDomain = await this.cache.get<string>(username, 'string');
    if (userCachedDomain) {
      return userCachedDomain;
    }

    const client = jayson.Client.https({
      host: 'api.nutshell.com',
      path: '/v1/json',
      headers: { Authorization: basicAuth },
    });

    const response = await client
      .request('getApiForUsername', {
        username,
      })
      .catch((reason) => {
        Sentry.captureException(reason);
        throw reason;
      });

    // Validate response
    let domain: string | undefined = undefined;
    if (validateGetApiForUsernameNutshellResponse(response)) {
      domain = response.result.api;
    }

    // Type safety - the validator should throw an error on failure
    if (!domain) {
      const err = new UnprocessableEntityException(
        'Domain could not be determined',
      );
      Sentry.captureException(err);
      throw err;
    }

    await this.cache.set(username, domain);

    return domain;
  }
}
