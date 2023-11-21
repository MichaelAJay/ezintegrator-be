export class ValidationError extends Error {
  validationErrors: any;

  constructor(message: any, validationErrors: any) {
    super(message);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}
