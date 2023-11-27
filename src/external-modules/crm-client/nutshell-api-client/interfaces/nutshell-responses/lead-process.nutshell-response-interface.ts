export type NutshellProcess = {
  stub: boolean;
  id: number;
  rev: string; // should be parseInt-able
  entityType: 'Processes';
  name: string;
  type: string;
  startedTime: string; // ex: 2023-10-25T00:20:13+0000
  closedTime: any; // presumed same as above
  currentMilestoneId: string; // should be parseInt-able
  processTemplateId: string; // should be parseInt-able
};
