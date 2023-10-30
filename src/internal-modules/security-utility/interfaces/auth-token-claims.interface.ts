export interface IAuthTokenClaims {
  iss: 'SELF';
  sub: string; // User Id
  exp: number;
}
