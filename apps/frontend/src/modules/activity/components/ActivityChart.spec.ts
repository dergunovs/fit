import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiChart, UiCheckbox, UiTabs } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ActivityChart from './ActivityChart.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetActivitiesChart } from '@/activity/mocks';
import { ACTIVITIES_CHART_FIXTURE } from '@/activity/fixtures';

const chart = dataTest('activity-chart');
const chartTypes = dataTest('activity-chart-types');
const chartMonth = dataTest('activity-chart-month');
const chartAverage = dataTest('activity-chart-average');

let wrapper: VueWrapper<InstanceType<typeof ActivityChart>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityChart);
});

enableAutoUnmount(afterEach);

describe('ActivityChart', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityChart)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows chart types', async () => {
    expect(wrapper.find(chartTypes).exists()).toBe(true);
  });

  it('gets chart data and sets props', async () => {
    expect(spyGetActivitiesChart).toBeCalledTimes(1);

    expect(wrapper.findComponent<typeof UiChart>(chart).props('type')).toStrictEqual('Line');

    expect(wrapper.findComponent<typeof UiChart>(chart).props('labels')).toStrictEqual(ACTIVITIES_CHART_FIXTURE.labels);

    expect(wrapper.findComponent<typeof UiChart>(chart).props('datasets')).toStrictEqual(
      ACTIVITIES_CHART_FIXTURE.datasets
    );
  });

  it('disables average checkbox when type is activity', async () => {
    expect(wrapper.findComponent<typeof UiCheckbox>(chartAverage).attributes('isdisabled')).toBe('true');

    await wrapper.findComponent<typeof UiTabs>(chartTypes).setValue('sets');

    expect(wrapper.findComponent<typeof UiCheckbox>(chartAverage).attributes('isdisabled')).toBe('false');

    await wrapper.findComponent<typeof UiCheckbox>(chartMonth).setValue(true);

    expect(wrapper.findComponent<typeof UiCheckbox>(chartAverage).attributes('isdisabled')).toBe('false');
  });
});
