import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiCalendar } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ActivityCalendar from './ActivityCalendar.vue';
import ActivityInfo from './ActivityInfo.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_CALENDAR_EVENTS } from '@/activity/fixtures';

const calendar = dataTest('activity-calendar');
const calendarModal = dataTest('activity-calendar-modal');
const activityInfo = dataTest('activity-calendar-info');

let wrapper: VueWrapper<InstanceType<typeof ActivityCalendar>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityCalendar, { events: ACTIVITY_CALENDAR_EVENTS });
});

enableAutoUnmount(afterEach);

describe('ActivityCalendar', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityCalendar)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('passes events to calendar', async () => {
    expect(wrapper.findComponent<typeof UiCalendar>(calendar).vm.$props.events).toStrictEqual(ACTIVITY_CALENDAR_EVENTS);
  });

  it('emits dates by calendar ready and update events', async () => {
    const dates = { firstCellDate: '01-02-2025', lastCellDate: '01-01-2025' };

    expect(wrapper.emitted()).not.toHaveProperty('ready');
    expect(wrapper.emitted()).not.toHaveProperty('update');

    wrapper.findComponent<typeof UiCalendar>(calendar).vm.$emit('ready', dates);

    expect(wrapper.emitted('ready')).toHaveLength(1);
    expect(wrapper.emitted()['ready'][0]).toStrictEqual([dates]);

    wrapper.findComponent<typeof UiCalendar>(calendar).vm.$emit('update', dates);

    expect(wrapper.emitted('update')).toHaveLength(1);
    expect(wrapper.emitted()['update'][0]).toStrictEqual([dates]);
  });

  it('emits delete event', async () => {
    expect(wrapper.find(calendarModal).attributes('modelvalue')).toBe('false');
    expect(wrapper.emitted()).not.toHaveProperty('deleteEvent');

    const event = ACTIVITY_CALENDAR_EVENTS[1];

    wrapper.findComponent<typeof UiCalendar>(calendar).vm.$emit('eventClick', event);

    await nextTick();

    expect(wrapper.find(calendarModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$emit('delete');

    await nextTick();

    expect(wrapper.emitted('deleteEvent')).toHaveLength(1);
    expect(wrapper.find(calendarModal).attributes('modelvalue')).toBe('false');
  });

  it('shows event in modal', async () => {
    expect(wrapper.find(calendarModal).attributes('modelvalue')).toBe('false');

    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.start).toStrictEqual(null);
    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.end).toStrictEqual(null);
    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.exercises).toStrictEqual([]);
    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.id).toStrictEqual('');

    const event = ACTIVITY_CALENDAR_EVENTS[1];

    wrapper.findComponent<typeof UiCalendar>(calendar).vm.$emit('eventClick', event);

    await nextTick();

    expect(wrapper.find(calendarModal).attributes('modelvalue')).toBe('true');

    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.start).toStrictEqual(event.start);
    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.end).toStrictEqual(event.end);
    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.exercises).toStrictEqual(event.content);
    expect(wrapper.findComponent<typeof ActivityInfo>(activityInfo).vm.$props.id).toStrictEqual(event._id);
  });
});
