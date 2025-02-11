import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import AppFeatures from './AppFeatures.vue';

import { wrapperFactory } from '@/common/test';
import { APP_FEATURES } from '@/common/constants';

const feature = dataTest('app-feature');
const title = dataTest('app-feature-title');
const text = dataTest('app-feature-text');

let wrapper: VueWrapper<InstanceType<typeof AppFeatures>>;

beforeEach(() => {
  wrapper = wrapperFactory(AppFeatures);
});

enableAutoUnmount(afterEach);

describe('AppFeatures', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(AppFeatures)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows features', async () => {
    expect(wrapper.findAll(feature).length).toBe(APP_FEATURES.length);
    expect(wrapper.find(title).text()).toBe(APP_FEATURES[0].title);
    expect(wrapper.find(text).text()).toBe(APP_FEATURES[0].text);
  });
});
