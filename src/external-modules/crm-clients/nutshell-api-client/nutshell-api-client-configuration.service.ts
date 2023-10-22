import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SecretManagerService } from 'src/external-modules/secret-manager/secret-manager.service';
import {
  INutshellApiClientConfigurationService,
  INutshellCredentials,
} from '.';
import * as jayson from 'jayson/promise';
import { generateBasicAuth } from 'src/utility';
import * as Sentry from '@sentry/node';
import { validateGetApiForUsernameNutshellResponse } from './validation/nutshell-api-responses';

@Injectable()
export class NutshellApiClientConfigurationService
  implements INutshellApiClientConfigurationService
{
  private cacheTTL_in_MS: number;
  constructor(
    private readonly secretManager: SecretManagerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.cacheTTL_in_MS = 20 * 60 * 1000;
  }
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
    const userCachedDomain = await this.cacheManager.get(username);
    if (typeof userCachedDomain === 'string') {
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

    await this.cacheManager
      .set(username, domain, this.cacheTTL_in_MS)
      .catch((reason) => {
        const err = new InternalServerErrorException(
          'Cache manager failure',
          reason,
        );
        Sentry.withScope((scope) => {
          scope.setExtra('message', reason.message);
          Sentry.captureException(err);
        });
        throw err;
      });

    return domain;
  }
}
