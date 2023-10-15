import { Injectable } from '@nestjs/common';
import { IUserDbQueryBuilder } from '.';

@Injectable()
export class UserDbQueryBuilderService implements IUserDbQueryBuilder {}
