import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as Sentry from '@sentry/node';
import { INutshellApiCache } from './interfaces';

@Injectable()
export class NutshellApiCacheService implements INutshellApiCache {
  private cacheTTL_in_MS: number;
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.cacheTTL_in_MS = 20 * 60 * 1000;
  }
  async cacheLead(leadId: string, accountId: string, data: any): Promise<void> {
    const key = this.generateLeadKey(leadId, accountId);
    await this.set(key, data);
  }
  async fetchLead<T>(
    leadId: string,
    accountId: string,
  ): Promise<T | undefined> {
    const key = this.generateLeadKey(leadId, accountId);
    const lead = await this.get<T>(key, 'object');
    return lead;
  }

  async removeLead(leadId: string, accountId: string) {
    const key = this.generateLeadKey(leadId, accountId);
    await this.delete(key);
  }

  // Helpers
  async get<T>(key: string, expectedType: string): Promise<T | undefined> {
    const val = await this.cacheManager.get<T>(key);
    if (typeof val === expectedType) {
      return val;
    }
    return undefined;
  }

  async set(key: string, value: any): Promise<void> {
    try {
      await this.cacheManager.set(key, value, this.cacheTTL_in_MS);
    } catch (err) {
      Sentry.captureException(err);
      const error = new InternalServerErrorException(
        'Cache manager failure',
        err,
      );
      throw error;
    }
  }

  async delete(key: string) {
    try {
      await this.cacheManager.del(key);
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setExtra('key', key);
        Sentry.captureException(err);
      });
      throw new InternalServerErrorException(
        'Value was not removed from cache',
        err,
      );
    }
  }

  generateLeadKey(leadId: string, accountId: string) {
    return `LEAD-${leadId}-FOR-${accountId}`;
  }
}
