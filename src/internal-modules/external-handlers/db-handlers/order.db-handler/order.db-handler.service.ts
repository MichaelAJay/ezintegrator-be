import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { OrderDbQueryBuilderService } from './order.db-query-builder.service';
import { IOrderDbHandler } from '.';

@Injectable()
export class OrderDbHandlerService implements IOrderDbHandler {
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: OrderDbQueryBuilderService,
  ) {}
}
