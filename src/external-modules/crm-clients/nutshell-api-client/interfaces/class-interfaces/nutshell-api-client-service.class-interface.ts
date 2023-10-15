export interface INutshellApiClientService {
  getLead(): any;
  updateLead(): any;
  createLead(): any;
  deleteLead(): any;
  addTaskToEntity(): any;
  getProducts(): any;
  internalLeadFetcher(): any;
  retrieveLeadFromCache(): any;
  cacheLead(): any;
  refreshLead(): any;
  tryTwice(): any;
}
