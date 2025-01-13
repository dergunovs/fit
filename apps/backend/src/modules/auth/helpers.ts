import type { IUser } from 'fitness-tracker-contracts';

export function decodeToken(decode?: (token: string) => IUser | null, authorizationHeader?: string) {
  const token = authorizationHeader ? authorizationHeader.split('Bearer ')[1] : undefined;

  return token && decode ? decode(token) : null;
}
