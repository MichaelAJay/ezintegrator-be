import { NutshellEntityCreator } from './entity-creator.nutshell-response-interface';
import { NutshellLeadAssignee } from './lead-assignee.nutshell-response-interface';
import { NutshellMarket } from './lead-market.nutshell-response-interface';
import { NutshellMilestone } from './lead-milestone.nutshell-response-interface';
import { NutshellProcess } from './lead-process.nutshell-response-interface';
import { NutshellStageset } from './lead-stageset.nutshell-response-interface';
import { NutshellProduct } from './product.nutshell-response-interface';

export type NutshellApiResponse_CreateLead = {
  result: NutshellCreateLeadResult;
};

export type NutshellCreateLeadResult = {
  id: number;
  entityType: 'Leads';
  rev: string; // should be parseInt-able
  modifiedTime: string; // ex: '2023-10-25T00:20:13+0000'
  createdTime: string; // ex: '2023-10-25T00:20:13+0000'
  name: string;
  description: string;
  htmlUrl: string;
  htmUrlPath: string;
  avatarUrl: string;
  creator: NutshellEntityCreator;
  primaryAccount: any; // Was null on checked response
  milestone: NutshellMilestone;
  stageset: NutshellStageset;
  activitiesCount: any; // deemed unimportant at the moment
  status: number;
  confidence: number;
  completion: number;
  urgency: string; // should be parseInt-able
  isOverdue: boolean;
  lastContactDate: any; // presumed date string - was null in result
  market: NutshellMarket;
  assignee: NutshellLeadAssignee;
  sources: any[]; // was empty on result
  competitors: any[]; // was empty on result
  products: NutshellProduct[];
  contacts: any[];
  accounts: any[];
  tags: string[];
  mergedWith: any;
  clonedFrom: any;
  priority: number;
  channels: any[];
  nextStepDueTime: string; // ex: 2023-09-21T16:32:52+0000
  value: {
    currency: 'USD';
    amount: number; // ex: 209.93
  };
  normalizedValue: {
    currency: 'USD';
    amount: number; // ex: 209.93
  };
  customFields: Record<string, string>; // THIS MAY NOT BE RIGHT
  processes: NutshellProcess[];
  notes: any[]; // was empty on check
  estimatedValue: {
    currency: 'USD';
    amount: number; // ex: 209.93
  };
};

export type NutshellApiResponseRequiredFields_CreateLead = {
  result: CreateLeadRequiredFieldsForOrderTarget;
};

export type CreateLeadRequiredFieldsForOrderTarget = Pick<
  NutshellCreateLeadResult,
  'id' | 'entityType'
>;
