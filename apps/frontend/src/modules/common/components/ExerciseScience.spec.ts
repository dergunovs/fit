import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseScience from './ExerciseScience.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof ExerciseScience>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseScience);
});

enableAutoUnmount(afterEach);

describe('ExerciseScience', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseScience)).toBeTruthy();
  });
});
