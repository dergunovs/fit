import type { IUser, TDecode } from 'fitness-tracker-contracts';

export function decodeToken(decode?: TDecode, authorizationHeader?: string) {
  const token = authorizationHeader ? authorizationHeader.split('Bearer ')[1] : undefined;

  return token && decode ? decode(token) : null;
}

export function filterUserData(user: IUser) {
  const filteredUser: IUser = {
    _id: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
    equipments: user.equipments,
    dateLoggedIn: user.dateLoggedIn,
  };

  return filteredUser;
}
