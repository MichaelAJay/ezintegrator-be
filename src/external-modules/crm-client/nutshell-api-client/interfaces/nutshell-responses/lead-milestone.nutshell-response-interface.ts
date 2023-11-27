export type NutshellMilestone = {
  stub: boolean;
  id: number;
  rev: string; // should be parseInt-able
  entityType: 'Milestones';
  name: string;
};
