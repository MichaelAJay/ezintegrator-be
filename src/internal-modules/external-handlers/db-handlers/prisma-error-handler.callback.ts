import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as Sentry from '@sentry/node';

export async function handlePrismaError(
  reason: any,
  retrieveFunction: (id: string) => Promise<any>,
  resourceId: string,
  accountId: string,
) {
  if (
    reason instanceof PrismaClientKnownRequestError &&
    reason.code === 'P2025'
  ) {
    const resource = await retrieveFunction(resourceId);
    if (!resource) {
      throw new NotFoundException();
    }
    if (resource.accountId !== accountId) {
      throw new ConflictException('Access denied');
    }
  }
  Sentry.captureException(reason);
  throw reason;
}
