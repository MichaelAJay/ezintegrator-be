import { InternalServerErrorException } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export function getEnvironmentVariable(envVarName: string): string {
  const envVar = process.env[envVarName];
  if (envVar === undefined) {
    const err = new InternalServerErrorException(
      'Missing environment variable',
    );
    Sentry.withScope((scope) => {
      scope.setExtra('envVar', envVarName);
      Sentry.captureException(err);
    });
    throw err;
  }
  return envVar;
}
