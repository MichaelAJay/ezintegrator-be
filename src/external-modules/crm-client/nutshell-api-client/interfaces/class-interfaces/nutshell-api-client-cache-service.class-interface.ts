export interface INutshellApiCache {
  cacheLead(leadId: string, accountId: string, data: any): Promise<void>;
  fetchLead<T>(leadId: string, accountId: string): Promise<T | undefined>;
  removeLead(leadId: string, accountId: string): Promise<void>;

  // HELPERS
  get<T>(key: string, expectedType: string): Promise<T | undefined>;
  set(key: string, value: any): void;
  generateLeadKey(leadId: string, accountId: string): string; // 'LEAD-<leadId>-FOR-<accountId>'
}
