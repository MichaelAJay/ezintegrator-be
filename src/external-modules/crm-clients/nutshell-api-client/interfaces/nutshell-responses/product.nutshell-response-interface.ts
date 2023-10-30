export type NutshellProduct = {
  stub: boolean;
  id: number;
  rev: string; // should be parseInt-able
  entityType: 'Products';
  modifiedTime: string; // ex: 2023-09-21T16:32:52+0000
  createdTime: string; // ex: 2023-09-21T16:32:52+0000
  name: string;
  relationship: any; // was null on result
  price: {
    currency: 'USD'; // Can add for non-US based clients
    amount: number; // ex: 10.99
  };
  quantity: number;
};
