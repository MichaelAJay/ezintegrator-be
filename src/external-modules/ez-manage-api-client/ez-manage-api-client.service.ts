import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';

@Injectable()
export class EzManageApiClientService {
  private defaultClientBaseUrl: string;

  constructor() {
    this.defaultClientBaseUrl = 'REPLACE THIS';
  }

  createClient(authToken: string, baseUrl?: string): GraphQLClient {
    return new GraphQLClient(baseUrl || this.defaultClientBaseUrl, {
      headers: { Authorization: authToken },
    });
  }

  async queryOrder(rec: any) {
    const baseUrl = 'REPLACE THIS';
    const authToken = rec.authToken;
    const client = this.createClient(baseUrl, authToken);
  }
  async queryOrderName() {}
  async getCatererName() {}
}
