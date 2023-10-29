import { OrderTargetDbModel } from 'src/external-modules';

export type CreateOrderTargetDbHandlerArgs = Omit<OrderTargetDbModel, 'id'>;
