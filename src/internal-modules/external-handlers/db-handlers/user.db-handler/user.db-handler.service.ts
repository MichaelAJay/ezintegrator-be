import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { UserDbQueryBuilderService } from './user.db-query-builder.service';
import { IUserDbHandler } from '.';

@Injectable()
export class UserDbHandlerService implements IUserDbHandler {
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: UserDbQueryBuilderService,
  ) {}
}
