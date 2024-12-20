import { vi } from 'vitest';
import { TGetUsersDTO } from 'fitness-tracker-contracts';

import { userService } from '@/user/services';
import { mockQueryReply } from '@/common/mocks';
import { USER_FIXTURE, USERS_FIXTURE } from '@/user/fixtures';

const spyGetUser = vi.spyOn(userService, 'getOne').mockReturnValue(mockQueryReply(USER_FIXTURE));

const getUsersData: TGetUsersDTO = { data: USERS_FIXTURE, total: USERS_FIXTURE.length };

const spyGetUsers = vi.spyOn(userService, 'getMany').mockImplementation(() => mockQueryReply(getUsersData));

export { spyGetUser, spyGetUsers, getUsersData };
