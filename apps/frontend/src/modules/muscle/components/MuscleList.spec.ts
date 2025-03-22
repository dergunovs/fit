import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import MuscleList from './MuscleList.vue';

import { wrapperFactory } from '@/common/test';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { URL_MUSCLE_EDIT } from '@/muscle/constants';

const muscleTableRow = dataTest('muscle-table-row');
const muscleTableTitleLink = dataTest('muscle-table-title-link');

let wrapper: VueWrapper<InstanceType<typeof MuscleList>>;

beforeEach(() => {
  wrapper = wrapperFactory(MuscleList, { muscles: MUSCLES_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('MuscleList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(MuscleList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows muscles in table', async () => {
    expect(wrapper.findAll(muscleTableRow).length).toBe(MUSCLES_FIXTURE.length);
    expect(wrapper.find(muscleTableTitleLink).text()).toBe(MUSCLES_FIXTURE[0].title);
  });

  it('sets muscle page link', async () => {
    expect(wrapper.find(muscleTableTitleLink).attributes('to')).toBe(`${URL_MUSCLE_EDIT}/${MUSCLES_FIXTURE[0]._id}`);
  });
});
