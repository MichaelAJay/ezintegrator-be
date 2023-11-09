export interface IGuardServiceProvider {
  getCookie(req: any, name: string): string;
}
