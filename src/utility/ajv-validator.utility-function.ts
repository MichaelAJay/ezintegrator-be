import { UnprocessableEntityException } from '@nestjs/common';
import * as Sentry from '@sentry/node';

// Returns true or throws error
export function validateWithAjv<T>(
  data: unknown,
  typeName: string,
  validator: (data: unknown) => boolean,
): data is T {
  const isValid = validator(data);
  if (!isValid) {
    const err = new UnprocessableEntityException('Data failed validation');
    Sentry.withScope((scope) => {
      scope.setExtra('typeName', typeName);
      Sentry.captureException(err);
    });
    throw err;
  }
  return isValid;
}