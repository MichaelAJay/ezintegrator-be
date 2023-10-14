import { JSONSchemaType } from 'ajv';
import { OrderDbModel } from '../order.db-model';

export const OrderDbSchema: JSONSchemaType<OrderDbModel> = {
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false,
};
