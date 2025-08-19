import { computed } from 'vue';
import { describe, it, expect } from 'vitest';
import {
  API_USER,
  API_USER_FEEDBACK,
  API_USER_PASSWORD,
  TDeleteUserDTO,
  TGetUserDTO,
  TGetUsersDTO,
  TPostUserDTO,
  TPostUserFeedbackDTO,
  TUpdateUserDTO,
  TUpdateUserPasswordDTO,
} from 'fitness-tracker-contracts';

import { serviceMocks } from '@/common/mocks';
import { userService } from '@/user/services';
import { USERS_FIXTURE, USER_FEEDBACK, USER_FIXTURE } from '@/user/fixtures';
import { BASE_REPLY, paginatedReply } from '@/common/fixtures';

const page = computed(() => 1);
const id = computed(() => '123');

describe('userService', () => {
  it('getMany', async () => {
    serviceMocks.http.mockGet<TGetUsersDTO>(paginatedReply(USERS_FIXTURE));
    userService.getMany(page);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(paginatedReply(USERS_FIXTURE));
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_USER, page]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_USER, { params: { page: page.value } });
  });

  it('getOne', async () => {
    serviceMocks.http.mockGet<TGetUserDTO>({ data: USER_FIXTURE });
    userService.getOne({}, id);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(USER_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_USER, id]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(`${API_USER}/${id.value}`);
  });

  it('create', async () => {
    serviceMocks.http.mockPost<TPostUserDTO>(BASE_REPLY);
    userService.create({});

    expect(await serviceMocks.lastMutation.mutationFn(USER_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_USER]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_USER, USER_FIXTURE);
  });

  it('feedback', async () => {
    serviceMocks.http.mockPost<TPostUserFeedbackDTO>(BASE_REPLY);
    userService.feedback({});

    expect(await serviceMocks.lastMutation.mutationFn(USER_FEEDBACK)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_USER_FEEDBACK]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_USER_FEEDBACK, USER_FEEDBACK);
  });

  it('update', async () => {
    serviceMocks.http.mockPatch<TUpdateUserDTO>(BASE_REPLY);
    userService.update({});

    expect(await serviceMocks.lastMutation.mutationFn(USER_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_USER]);
    expect(serviceMocks.http.patch).toHaveBeenCalledWith(`${API_USER}/${USER_FIXTURE._id}`, USER_FIXTURE);
  });

  it('updatePaswword', async () => {
    serviceMocks.http.mockPatch<TUpdateUserPasswordDTO>(BASE_REPLY);
    userService.updatePassword({});

    expect(
      await serviceMocks.lastMutation.mutationFn({ password: USER_FIXTURE.password, id: USER_FIXTURE._id })
    ).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_USER_PASSWORD]);
    expect(serviceMocks.http.patch).toHaveBeenCalledWith(`${API_USER_PASSWORD}/${USER_FIXTURE._id}`, {
      password: USER_FIXTURE.password,
    });
  });

  it('delete', async () => {
    serviceMocks.http.mockDelete<TDeleteUserDTO>(BASE_REPLY);
    userService.delete({});

    expect(await serviceMocks.lastMutation.mutationFn(id.value)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_USER]);
    expect(serviceMocks.http.delete).toHaveBeenCalledWith(`${API_USER}/${id.value}`);
  });
});
