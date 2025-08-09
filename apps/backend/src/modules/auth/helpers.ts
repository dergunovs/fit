import type { IUser, TDecode } from 'fitness-tracker-contracts';

export function decodeToken(decode?: TDecode, authorizationHeader?: string): IUser | null {
  const token = authorizationHeader ? authorizationHeader.split('Bearer ')[1] : undefined;

  if (!token || !decode) return null;

  const user = decode(token) || null;

  return user;
}

export function filterUserData(user: IUser, isToken?: boolean) {
  const filteredUser: IUser = {
    _id: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
    isResetPassword: user.isResetPassword,
    equipments: isToken ? undefined : user.equipments,
    defaultWeights: isToken ? {} : user.defaultWeights,
    dateLoggedIn: user.dateLoggedIn,
  };

  return filteredUser;
}

export function allowAccessToAdminAndCurrentUser(id: string, decode?: TDecode, token?: string) {
  const user = decodeToken(decode, token);

  if (user?.role !== 'admin' && id.toString() !== user?._id) {
    throw new Error('Auth error', { cause: { code: 403 } });
  }
}

export function adminOrUserFilter(decode?: TDecode, token?: string) {
  const decodedUser = decodeToken(decode, token);

  return decodedUser ? { email: decodedUser.email } : { role: 'admin' };
}
