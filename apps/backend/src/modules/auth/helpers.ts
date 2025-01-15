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
    equipments: isToken ? undefined : user.equipments,
    dateLoggedIn: user.dateLoggedIn,
  };

  return filteredUser;
}
