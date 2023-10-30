import { Injectable } from '@nestjs/common';
import { IOrderTargetDbHandlerClass } from '../interfaces';
import { CreateOrderTargetDbHandlerArgs } from './args';

@Injectable()
export class OrderTargetDbHandlerService implements IOrderTargetDbHandlerClass {
  async create(args: CreateOrderTargetDbHandlerArgs): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
