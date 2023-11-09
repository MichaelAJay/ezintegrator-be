import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { IMenuDbHandler } from '.';
import { MenuDbQueryBuilderService } from './menu.db-query-builder.service';

@Injectable()
export class MenuDbHandlerService implements IMenuDbHandler {
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: MenuDbQueryBuilderService,
  ) {}
}
