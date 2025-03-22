import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import MuscleListPage from './MuscleListPage.vue';
import MuscleList from '@/muscle/components/MuscleList.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetMuscles } from '@/muscle/mocks';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { URL_MUSCLE_CREATE } from '@/muscle/constants';

const muscleList = dataTest('muscle-list');
const addMuscle = dataTest('add-muscle');

let wrapper: VueWrapper<InstanceType<typeof MuscleListPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(MuscleListPage);
});

enableAutoUnmount(afterEach);

describe('MuscleListPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(MuscleListPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets create muscle link', async () => {
    expect(wrapper.find(addMuscle).attributes('to')).toBe(URL_MUSCLE_CREATE);
  });

  it('gets and sets muscles to list', async () => {
    expect(spyGetMuscles).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof MuscleList>(muscleList).vm.$props.muscles).toStrictEqual(MUSCLES_FIXTURE);
  });
});
