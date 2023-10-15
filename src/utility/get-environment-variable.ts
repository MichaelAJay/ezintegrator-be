import { InternalServerErrorException } from '@nestjs/common';

export function getEnvironmentVariable(envVarName: string): string {
  const envVar = process.env[envVarName];
  if (envVar === undefined) {
    throw new InternalServerErrorException('Missing environment variable');
  }
  return envVar;
}
