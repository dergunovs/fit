import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityCreatePage from './ActivityCreatePage.vue';

import { wrapperFactory } from '@/common/test';

const activityForm = dataTest('activity-form');

let wrapper: VueWrapper<InstanceType<typeof ActivityCreatePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityCreatePage);
});

enableAutoUnmount(afterEach);

describe('ActivityCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityCreatePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows activity form', async () => {
    expect(wrapper.find(activityForm).exists()).toBe(true);
  });
});
