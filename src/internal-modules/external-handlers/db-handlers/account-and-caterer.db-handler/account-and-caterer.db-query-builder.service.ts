import { Injectable } from '@nestjs/common';
import { IAccountAndCatererDbQueryBuilder } from '.';

@Injectable()
export class AccountAndCatererDbQueryBuilderService
  implements IAccountAndCatererDbQueryBuilder {}
