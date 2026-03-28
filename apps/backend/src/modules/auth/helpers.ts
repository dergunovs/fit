import type { FastifyRequest } from 'fastify';
import type { IUser, TDecode } from 'fitness-tracker-contracts';

import { error } from '../common/errorHandler.js';

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
    templates: isToken ? undefined : user.templates,
    defaultWeights: isToken ? {} : user.defaultWeights,
    dateLoggedIn: user.dateLoggedIn,
    goalActivities: user.goalActivities,
    goalSets: user.goalSets,
    goalRepeats: user.goalRepeats,
    goalDuration: user.goalDuration,
  };

  return filteredUser;
}

export function allowAccessToAdminAndCurrentUser(userId: string, user: IUser): void {
  const isRestrictAccess = user.role !== 'admin' && userId.toString() !== user._id;

  if (isRestrictAccess) throw error.forbidden();
}

export function adminOrUserFilter(user: IUser | undefined) {
  return user ? { email: user.email } : { role: 'admin' };
}

export function requireUser(request: FastifyRequest): IUser {
  if (!request.currentUser) throw error.unauthorized();

  return request.currentUser;
}
