import { Prisma } from '@prisma/client';

export type IUpdateUserDbQueryBuilderArgs = Partial<
  Pick<
    Prisma.UserUncheckedUpdateInput,
    'email' | 'firstName' | 'lastName' | 'hashedPassword' | 'hashedRt' | 'salt'
  >
>;
