import { Prisma } from '@prisma/client';

export type ICreateUserDbQueryBuilderArgs = Omit<
  Prisma.UserUncheckedCreateInput,
  'id' | 'archivedOrders'
>;
