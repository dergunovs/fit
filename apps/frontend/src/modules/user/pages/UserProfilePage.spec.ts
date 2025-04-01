import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserProfilePage from './UserProfilePage.vue';
import UserForm from '@/user/components/UserForm.vue';
import UserExercises from '@/user/components/UserExercises.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

import { wrapperFactory } from '@/common/test';
import { spyUseAuthCheck } from '@/auth/mocks';
import { USER_FIXTURE } from '@/user/fixtures';
import { spyGetExercisesCustom } from '@/exercise/mocks';
import { EXERCISE_FIXTURE_CUSTOM } from '@/exercise/fixtures';

const userForm = dataTest('user-form');
const userExercises = dataTest('user-exercises');
const userAddExercise = dataTest('user-add-exercise');
const userExerciseForm = dataTest('user-exercise-form');
const userExerciseFormModal = dataTest('user-exercise-form-modal');

let wrapper: VueWrapper<InstanceType<typeof UserProfilePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserProfilePage, undefined, {
    UserForm: { template: '<div><slot></slot></div>', props: ['user'] },
  });
});

enableAutoUnmount(afterEach);

describe('UserProfilePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserProfilePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets and sets user to form', async () => {
    expect(spyUseAuthCheck).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof UserForm>(userForm).vm.$props.user).toStrictEqual(USER_FIXTURE);
  });

  it('gets and sets user custom exercises', async () => {
    expect(spyGetExercisesCustom).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof UserExercises>(userExercises).vm.$props.exercises).toStrictEqual([
      EXERCISE_FIXTURE_CUSTOM,
    ]);
  });

  it('shows form modal by add exercise button click', async () => {
    expect(wrapper.find(userExerciseFormModal).attributes('modelvalue')).toBe('false');

    await wrapper.find(userAddExercise).trigger('click');

    expect(wrapper.find(userExerciseFormModal).attributes('modelvalue')).toBe('true');
  });

  it('sets emited exercise to edit in modal', async () => {
    expect(wrapper.find(userExerciseFormModal).attributes('modelvalue')).toBe('false');

    expect(wrapper.findComponent<typeof ExerciseForm>(userExerciseForm).vm.$props.exercise).toStrictEqual(undefined);

    wrapper.findComponent<typeof UserExercises>(userExercises).vm.$emit('edit', EXERCISE_FIXTURE_CUSTOM);

    await nextTick();

    expect(wrapper.find(userExerciseFormModal).attributes('modelvalue')).toBe('true');

    expect(wrapper.findComponent<typeof ExerciseForm>(userExerciseForm).vm.$props.exercise).toStrictEqual(
      EXERCISE_FIXTURE_CUSTOM
    );
  });

  it('hides form modal and clears current exercise by hide emit', async () => {
    expect(wrapper.find(userExerciseFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<typeof UserExercises>(userExercises).vm.$emit('edit', EXERCISE_FIXTURE_CUSTOM);

    await nextTick();

    expect(wrapper.find(userExerciseFormModal).attributes('modelvalue')).toBe('true');

    expect(wrapper.findComponent<typeof ExerciseForm>(userExerciseForm).vm.$props.exercise).toStrictEqual(
      EXERCISE_FIXTURE_CUSTOM
    );

    wrapper.findComponent<typeof ExerciseForm>(userExerciseForm).vm.$emit('hide');

    await nextTick();

    expect(wrapper.find(userExerciseFormModal).attributes('modelvalue')).toBe('false');

    expect(wrapper.findComponent<typeof ExerciseForm>(userExerciseForm).vm.$props.exercise).toStrictEqual(undefined);
  });
});
