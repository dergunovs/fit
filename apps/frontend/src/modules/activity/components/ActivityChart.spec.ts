import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiChart } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ActivityChart from './ActivityChart.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetActivitiesChart } from '@/activity/mocks';
import { ACTIVITIES_CHART_FIXTURE } from '@/activity/fixtures';

const chart = dataTest('activity-chart');
const chartType = dataTest('activity-chart-type');

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

  it('shows chart type buttons', async () => {
    expect(wrapper.findAll(chartType).length).toBe(4);

    expect(wrapper.findAll(chartType)[0].attributes('layout')).toBe('accent');
    expect(wrapper.findAll(chartType)[1].attributes('layout')).toBe('primary');

    expect(wrapper.find(chartType).text()).toBe('Занятия');
  });

  it('gets chart data and sets props', async () => {
    expect(spyGetActivitiesChart).toBeCalledTimes(1);

    expect(wrapper.findComponent<typeof UiChart>(chart).vm.$props.labels).toStrictEqual(
      ACTIVITIES_CHART_FIXTURE.labels
    );

    expect(wrapper.findComponent<typeof UiChart>(chart).vm.$props.datasets).toStrictEqual(
      ACTIVITIES_CHART_FIXTURE.datasets
    );
  });

  it('shows legend if chart type is muscle groups', async () => {
    const muscleGroupsTypeIndex = 3;

    expect(wrapper.findComponent<typeof UiChart>(chart).vm.$props.isShowLegend).toStrictEqual(false);

    await wrapper.findAll(chartType)[muscleGroupsTypeIndex].trigger('click');

    expect(wrapper.findComponent<typeof UiChart>(chart).vm.$props.isShowLegend).toStrictEqual(true);
  });
});
