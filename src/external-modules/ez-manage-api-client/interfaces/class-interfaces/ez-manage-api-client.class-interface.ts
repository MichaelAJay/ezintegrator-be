import { GraphQLClient } from 'graphql-request';

export interface IEzManageApiClient {
  createClient(authToken: string, baseUrl?: string): GraphQLClient;
  queryOrder(rec: any): any;
  queryOrderName(input: any): any;
  getCatererName(input: any): any;
}
