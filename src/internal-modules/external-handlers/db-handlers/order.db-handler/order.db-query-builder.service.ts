import { Injectable } from '@nestjs/common';
import { IOrderDbQueryBuilder } from '.';

@Injectable()
export class OrderDbQueryBuilderService implements IOrderDbQueryBuilder {}
