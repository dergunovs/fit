import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiChip } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import UserFormTemplateElement from './UserFormTemplateElement.vue';

import { wrapperFactory } from '@/common/test';
import { USER_TEMPLATE } from '@/user/fixtures';

const template = dataTest('user-form-template');
const title = dataTest('user-form-template-title');

let wrapper: VueWrapper<InstanceType<typeof UserFormTemplateElement>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserFormTemplateElement, { template: USER_TEMPLATE });
});

enableAutoUnmount(afterEach);

describe('UserFormTemplateElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormTemplateElement)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows template title', async () => {
    expect(wrapper.find(title).text()).toStrictEqual(USER_TEMPLATE.title);
  });

  it('emits template by edit button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('edit');

    wrapper.findComponent<typeof UiChip>(template).vm.$emit('edit');

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted()['edit'][0]).toStrictEqual([]);
  });

  it('emits id by delete button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    wrapper.findComponent<typeof UiChip>(template).vm.$emit('delete');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([]);
  });
});
