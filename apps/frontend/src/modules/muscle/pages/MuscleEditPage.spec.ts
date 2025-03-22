import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import MuscleEditPage from './MuscleEditPage.vue';
import MuscleForm from '@/muscle/components/MuscleForm.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetMuscle } from '@/muscle/mocks';
import { spyUseRouteId, mockRouteId } from '@/common/mocks';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

const muscleForm = dataTest('muscle-form');

let wrapper: VueWrapper<InstanceType<typeof MuscleEditPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(MuscleEditPage);
});

enableAutoUnmount(afterEach);

describe('MuscleEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(MuscleEditPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets and sets muscle to form', async () => {
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('muscle');

    expect(spyGetMuscle).toBeCalledTimes(1);
    expect(spyGetMuscle).toBeCalledWith({}, mockRouteId);

    expect(wrapper.findComponent<typeof MuscleForm>(muscleForm).vm.$props.muscle).toStrictEqual(MUSCLES_FIXTURE[0]);
  });
});
