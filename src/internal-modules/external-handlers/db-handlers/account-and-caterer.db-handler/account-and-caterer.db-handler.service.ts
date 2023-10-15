import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { AccountAndCatererDbQueryBuilderService } from './account-and-caterer.db-query-builder.service';
import { IAccountAndCatererDbHandler } from '.';

@Injectable()
export class AccountAndCatererDbHandlerService
  implements IAccountAndCatererDbHandler
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: AccountAndCatererDbQueryBuilderService,
  ) {}
}
