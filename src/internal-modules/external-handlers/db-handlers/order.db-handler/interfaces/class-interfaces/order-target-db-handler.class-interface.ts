import { CreateOrderTargetDbHandlerArgs } from '../../order-target/args';

export interface IOrderTargetDbHandlerClass {
  create(args: CreateOrderTargetDbHandlerArgs): Promise<any>;
}
