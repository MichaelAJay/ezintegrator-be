import { OrderTargetDbModel } from '../../../../../../external-modules';

export type CreateOrderTargetDbHandlerArgs = Omit<OrderTargetDbModel, 'id'>;
