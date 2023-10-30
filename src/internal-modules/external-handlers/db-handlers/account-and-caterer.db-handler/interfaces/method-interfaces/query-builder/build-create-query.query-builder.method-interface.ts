import { Prisma } from '@prisma/client';

export type IBuildCreateAccountQueryArgs = Omit<
  Prisma.AccountUncheckedCreateInput,
  'id' | 'catererers' | 'users' | 'crm' | 'processes' | 'secretReferences'
>;
