import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseChoosenElement from './ExerciseChoosenElement.vue';
import ExerciseChoosenButtons from '@/exercise/components/ExerciseChoosenButtons.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_CHOOSEN_FIXTURE } from '@/exercise/fixtures';

const title = dataTest('exercise-choosen-title');
const buttons = dataTest('exercise-choosen-buttons');

const INDEX = 1;
const IS_SET_CREATABLE = true;
const IS_LAST = false;

let wrapper: VueWrapper<InstanceType<typeof ExerciseChoosenElement>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChoosenElement, {
    exercise: EXERCISE_CHOOSEN_FIXTURE,
    index: INDEX,
    isSetCreatable: IS_SET_CREATABLE,
    isLast: IS_LAST,
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseChoosenElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChoosenElement)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows title', async () => {
    expect(wrapper.find(title).text()).toBe(`${INDEX + 1}. ${EXERCISE_CHOOSEN_FIXTURE.exercise?.title}`);
  });

  it('passes props to buttons', async () => {
    expect(wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).props('repeats')).toBe(
      EXERCISE_CHOOSEN_FIXTURE.repeats
    );
    expect(wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).props('weight')).toBe(
      EXERCISE_CHOOSEN_FIXTURE.weight
    );

    expect(wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).props('index')).toBe(INDEX);
    expect(wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).props('isLast')).toBe(IS_LAST);
    expect(wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).props('isSetCreatable')).toBe(
      IS_SET_CREATABLE
    );
  });

  it('emits events from buttons', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('createSet');
    expect(wrapper.emitted()).not.toHaveProperty('delete');
    expect(wrapper.emitted()).not.toHaveProperty('setIndex');

    wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).vm.$emit('createSet');

    expect(wrapper.emitted('createSet')).toHaveLength(1);
    expect(wrapper.emitted()['createSet'][0]).toStrictEqual([]);

    wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).vm.$emit('delete', EXERCISE_CHOOSEN_FIXTURE._id);

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([EXERCISE_CHOOSEN_FIXTURE._id]);

    wrapper.findComponent<typeof ExerciseChoosenButtons>(buttons).vm.$emit('setIndex', INDEX + 1);

    expect(wrapper.emitted('setIndex')).toHaveLength(1);
    expect(wrapper.emitted()['setIndex'][0]).toStrictEqual([INDEX + 1]);
  });

  it('hides buttons when no exercise id', async () => {
    expect(wrapper.find(buttons).exists()).toBe(true);

    await wrapper.setProps({ exercise: { _id: undefined, repeats: 0 } });

    expect(wrapper.find(buttons).exists()).toBe(false);
  });
});
