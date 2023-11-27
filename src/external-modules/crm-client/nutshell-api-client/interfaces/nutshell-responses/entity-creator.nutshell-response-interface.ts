export type NutshellEntityCreator = {
  stub: boolean;
  id: number;
  rev: string; // should be parseInt-able;
  modifiedTime: string; // ex: 2023-09-21T16:32:52+0000
  createdTime: string; // ex: 2023-09-21T16:32:52+0000
  name: string;
  emails: string[];
  isEnabled: boolean;
  isAdministrator: boolean;
};
