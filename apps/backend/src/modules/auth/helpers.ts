import type { IUser, TDecode } from 'fitness-tracker-contracts';

export function decodeToken(decode?: TDecode, authorizationHeader?: string): IUser | null {
  const token = authorizationHeader ? authorizationHeader.split('Bearer ')[1] : undefined;

  if (!token || !decode) return null;

  // eslint-disable-next-line no-underscore-dangle
  const user = decode(token)?._doc || null;

  return user;
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
