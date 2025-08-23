import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import AppFeatures from './AppFeatures.vue';

import { wrapperFactory } from '@/common/test';

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
    expect(wrapper.findAll(feature).length).toBe(3);
    expect(wrapper.find(title).text()).toBe('Отслеживайте прогресс');
    expect(wrapper.find(text).text()).toBe(
      'Таблица со статистикой по упражнениям. Графики с динамикой по занятиям, подходам, повторам, времени и группам мышц.'
    );
  });
});
