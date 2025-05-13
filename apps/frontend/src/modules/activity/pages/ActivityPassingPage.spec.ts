import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';
import { API_ACTIVITY, API_ACTIVITY_CHART, API_ACTIVITY_STATISTICS } from 'fitness-tracker-contracts';

import ActivityPassingPage from './ActivityPassingPage.vue';
import ActivityPassingForm from '@/activity/components/ActivityPassingForm.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyGetActivity, spyUpdateActivity } from '@/activity/mocks';
import { mockRouteId, spyRefetchQueries, spyRouterPush, spyToastSuccess, spyUseRouteId } from '@/common/mocks';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { URL_HOME } from '@/common/constants';

const form = dataTest('activity-passing-form');

const formData = {
  dateCreated: undefined,
  dateUpdated: undefined,
  exercises: [],
  isDone: false,
};

let wrapper: VueWrapper<InstanceType<typeof ActivityPassingPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityPassingPage);
});

enableAutoUnmount(afterEach);

describe('ActivityPassingPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityPassingPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets activity', async () => {
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('activity');

    expect(spyGetActivity).toBeCalledTimes(1);
    expect(spyGetActivity).toBeCalledWith({}, mockRouteId);
  });

  it('updates activity create date', async () => {
    const dateCreated = new Date();

    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual(formData);

    wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$emit('setDateCreated', dateCreated);

    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual({
      dateCreated,
      dateUpdated: undefined,
      exercises: [],
      isDone: false,
    });
  });

  it('updates activity update date', async () => {
    const dateUpdated = new Date();

    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual(formData);

    wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$emit('setDateUpdated', dateUpdated);

    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual({
      dateCreated: undefined,
      dateUpdated,
      exercises: [],
      isDone: false,
    });
  });

  it('updates activity exercises', async () => {
    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual(formData);

    wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$emit('updateExercises', EXERCISES_DONE_FIXTURE);

    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual({
      dateCreated: undefined,
      dateUpdated: undefined,
      exercises: EXERCISES_DONE_FIXTURE,
      isDone: false,
    });
  });

  it('finishes activity', async () => {
    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual(formData);

    wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$emit('done', true);

    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual({
      dateCreated: undefined,
      dateUpdated: undefined,
      exercises: [],
      isDone: true,
    });
  });

  it('exits activity page', async () => {
    expect(spyUpdateActivity).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$emit('exit');

    expect(spyUpdateActivity).toBeCalledTimes(1);
    expect(spyUpdateActivity).toBeCalledWith(formData);

    await mockOnSuccess.update?.();

    expect(spyToastSuccess).toBeCalledTimes(1);

    await wait(1000);

    expect(spyRefetchQueries).toBeCalledTimes(3);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_CHART] });

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_HOME);
  });
});
